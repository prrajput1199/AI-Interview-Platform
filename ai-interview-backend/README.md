# AI Interview Platform — Backend

A production backend for the AI Interview Platform: Node.js, Express 5, TypeScript, Prisma 7
(Neon serverless driver adapter), Firebase Admin (Google auth), Gemini (question generation,
answer evaluation, interview reports, resume analysis), Razorpay (credits/payments), and
PDFKit (report PDFs). Implements every endpoint in the provided Postman collection against
the provided Prisma schema.

## Architecture

```
Route → Controller → Service → Prisma / external service
```

Routes only wire up middleware and call a controller method. Controllers read the request,
call exactly one service method, and shape the response — no Prisma queries, no Gemini/
Razorpay calls, no business rules live in a controller. Services hold all business logic and
are the only layer that talks to Prisma or the external service wrappers.

External integrations are isolated behind single-purpose services, never called directly from
a controller or route:

```
InterviewService → GeminiService → Gemini API
PaymentService   → RazorpayService → Razorpay API
AuthService      → FirebaseService → Firebase Admin (auth only)
ResumeService    → SupabaseStorageService → Supabase Storage (files)
ResumeService    → PdfService (extractText) / GeminiService (analyzeResume)
InterviewService → PdfService (generateInterviewReportPdf)
```

```
src/
  app.ts, server.ts        Express app assembly / process bootstrap
  config/                  env validation (Zod), cookie options
  routes/index.ts          mounts every module under /api/v1
  middlewares/             auth, validation, upload (multer), rate limiting, error handling
  modules/
    auth/ users/ interviews/ resume/ payments/ analytics/ interview-modes/
      *.routes.ts    route wiring only
      *.controller.ts  thin — reads req, calls one service method, sends response
      *.service.ts     business logic, Prisma queries, transactions
      *.validation.ts  Zod schemas
      *.types.ts       response DTO shapes
  services/
    gemini/    the only place @google/generative-ai is imported; retries + Zod-validates
               every AI response before it's trusted
    firebase/  the only place firebase-admin is imported
    razorpay/  the only place the razorpay SDK is imported; HMAC verification for both
               payment confirmation and the webhook
    pdf/       report PDF generation (pdfkit) + resume text extraction (pdf-parse)
  prisma/client.ts         single shared PrismaClient (Neon adapter) — never instantiate elsewhere
  utils/                   errors, asyncHandler, API response helpers, pagination, JWT, logger
```

## Modules implemented

Health check · Auth (Google/Firebase) · User profile · Interviews (create, generate
questions, get detail, submit answer, complete, history, PDF report) · Resume (upload,
get, delete) · Payments (create order, verify, balance, transactions, webhook) · Analytics
(dashboard, trend, skills, question performance) · Interview modes.

## AI integration (Gemini)

`GeminiService` (`src/services/gemini/gemini.service.ts`) is the only place the Gemini SDK is
touched. It exposes four methods — `generateInterviewQuestions`, `evaluateAnswer`,
`generateInterviewReport`, `analyzeResume` — each of which:

1. Builds a structured prompt (resume/mode/track context where relevant) and asks Gemini for
   `application/json`-only output.
2. Retries up to 3 times with exponential backoff on transient failures (network errors, rate
   limits) — but never retries a validation failure, since retrying won't fix a bad schema
   match.
3. Parses the response and validates it against a Zod schema (`gemini.types.ts`) before
   returning it. Malformed or out-of-range AI output never reaches Prisma; it surfaces as a
   controlled `503 SERVICE_UNAVAILABLE` instead.

The model is configurable via `GEMINI_MODEL` — nothing is hardcoded.

## Database (Prisma + Neon)

The schema uses the `prisma-client` generator with a custom output (`../generated/prisma`),
paired with `@prisma/adapter-neon` + `@neondatabase/serverless` — the driver-adapter
architecture, not Prisma's bundled query-engine binary. `src/prisma/client.ts` is the single
place `PrismaClient` is constructed; every service imports `prisma` from there.

Transactions (`prisma.$transaction`) are used everywhere multiple writes must succeed or fail
together: interview creation (credit check + interview row + wallet decrement + ledger entry),
question generation (insert questions + flip status), answer submission (relies on the
DB-level unique constraint on `answer.questionId` to reject a second answer for the same
question, even under concurrent requests — no separate lock needed), interview completion
(report row + status/score update), and payment capture (status update + wallet increment +
ledger entry, re-checked for idempotency *inside* the transaction to close the race between
`/verify` and the webhook).

## Payments (Razorpay)

The frontend only ever sends `credits`; the backend computes `amount` from
`PRICE_PER_CREDIT_PAISE` — the amount is never trusted from the client. A `Payment` row is
created in `CREATED` status at order-creation time (tied to the authenticated user), which
lets `/verify` confirm the caller actually owns that order before crediting anything.

- `POST /payments/create-order` — creates the Razorpay order + pending `Payment` row.
- `POST /payments/verify` — checks HMAC-SHA256(orderId|paymentId) against Razorpay's secret
  (timing-safe comparison), then credits the wallet. Idempotent: a second call for an
  already-captured payment just returns the existing result.
- `POST /payments/webhook` — **no auth**, per the API contract. Verifies
  `X-Razorpay-Signature` against the *raw* request body (see "Raw body for the webhook"
  below) using the webhook secret, then calls the same capture-and-credit logic used by
  `/verify`. Also idempotent, and safe if it arrives before, after, or instead of `/verify`.

### Raw body for the webhook

Express's JSON body parser is applied globally so every other route gets a parsed `req.body`
— but a webhook's signature must be checked against the *exact bytes* Razorpay sent. In
`app.ts`, `/api/v1/payments/webhook` gets its own `express.raw()` parser mounted **before**
the general JSON parser, and the general parser explicitly skips that one path (re-running a
JSON parser over an already-consumed stream would silently produce an empty body). The
webhook controller verifies the signature against the raw `Buffer`, then `JSON.parse`s it
itself.

## Security

- **Auth**: Google ID token → Firebase Admin verification → find-or-create `User` → our own
  JWT, set as an `httpOnly`, `sameSite` (`lax` in dev, `none`+`secure` in production) cookie
  named `interview_token`. No token is ever returned in a JSON body or readable from JS.
- **Authorization**: every interview/resume/payment lookup checks `record.userId === req.user.id`
  and throws `403 Forbidden` otherwise — ownership is never inferred from the frontend.
- **Validation**: every body/query/param is parsed through a Zod schema (`validate` middleware)
  before it reaches a controller.
- **Webhook verification**: HMAC-SHA256 over the raw body, timing-safe compared.
- **File uploads**: PDF-only by MIME + extension at the multer layer, then a magic-byte
  (`%PDF`) check in `PdfService` before anything is parsed — extension/MIME alone are not trusted.
  Files never touch local disk (see "File storage" below).
- **Rate limiting**: a general limiter on all `/api` traffic, and a tighter one on
  auth/Gemini/payment endpoints (`express-rate-limit` — see "Notes on package.json" below).
- **Headers/CORS**: `helmet()`, and CORS locked to `FRONTEND_URL` with `credentials: true`
  (never `*` with credentials).
- **Error responses**: the global error middleware maps Prisma/Multer/JWT errors to
  consistent `{ success: false, message, error: { code } }` bodies and never leaks a stack
  trace, Prisma internals, or secrets in production.

## File storage (resumes)

Resume PDFs are stored in **Supabase Storage**, not on local disk and not in Firebase Storage. Supabase's free tier (1GB file storage) genuinely requires no card, so that's what this uses instead. Firebase itself is still used for Google auth — only file
storage moved.

### One-time setup in the Supabase dashboard

1. Create a free project at [supabase.com](https://supabase.com) (no card required).
2. **Storage → Create a new bucket.** Name it `resumes` (or anything — just match
   `SUPABASE_STORAGE_BUCKET`). Leave it **private** (don't toggle "Public bucket") — resumes
   are personal data, and the backend hands out short-lived signed URLs instead.
3. **Project Settings → API.** Copy the **Project URL** into `SUPABASE_URL`, and the
   **`service_role`** secret key (not the `anon` public key) into `SUPABASE_SERVICE_ROLE_KEY`.
   The service role key bypasses Row Level Security, which is intentional here — it's only
   ever used server-side and never sent to the frontend.

Flow (`resume.service.ts` + `services/supabase/supabase.service.ts`):

1. `upload.middleware.ts` uses `multer.memoryStorage()` — the file exists only as a `Buffer`
   in the request, never written to disk.
2. `PdfService.extractText` validates the magic bytes and extracts text from that buffer.
3. `SupabaseStorageService.uploadFile` uploads the buffer to
   `resumes/{userId}/{uuid}.pdf` in the bucket.
4. Only the **object path** is stored in `Resume.fileURL` — not a URL. Since the bucket is
   private, `GET /resume` generates a fresh, short-lived signed URL
   (`SupabaseStorageService.getSignedDownloadUrl`, 15 minutes) every time it's requested,
   rather than persisting a URL that would eventually expire.
5. Deleting a resume (or replacing it with a new upload) also deletes the Storage object,
   via a best-effort `deleteFileQuietly` that never fails the request even if the object is
   already gone.

```bash
npm install              # also runs `prisma generate` via postinstall
cp .env.example .env     # fill in the values below
npx prisma migrate dev   # creates the Postgres schema (needs a real DATABASE_URL)
npm run dev
```

> **A note on `prisma generate` in this delivery:** the code was written and the dependency
> tree installed successfully, but the sandbox this was built in blocks the network domain
> Prisma downloads its schema-engine binary from, so `prisma generate` / `prisma migrate` and
> a full `tsc` build could not actually be executed here. They should work normally in your
> environment. Run `npm run typecheck` right after `prisma generate` to confirm — if the new
> `prisma-client` generator's output path differs slightly from what `src/prisma/client.ts`
> and `src/middlewares/error.middleware.ts` import (`../../generated/prisma/client`), that
> import path is the only thing likely to need a one-line adjustment.

## Scripts

```bash
npm run dev             # ts-node + nodemon
npm run build            # prisma generate && tsc
npm run start            # node dist/server.js
npm run typecheck        # tsc --noEmit
npm run prisma:generate
npm run prisma:migrate
```

No test runner was configured in the provided `package.json` (`"test"` is a placeholder), so
none was added silently — see "Notes on package.json" below.

## Environment variables

See `.env.example` for the full list with descriptions. Everything in it is actually read by
`src/config/env.ts` (Zod-validated at startup — the process exits with a clear message if
anything required is missing) — nothing extra was added.

## Identified API / schema inconsistencies

These were found while implementing against both files together, and handled as additive,
clearly-flagged fixes rather than silently changed contracts:

1. **`Interview.resumeId` was missing.** The Create Interview request body documents a
   `resumeId`, but the original `Interview` model had no field to store it. Added
   `resumeId String?` + a nullable relation to `Resume` (`onDelete: SetNull`, so deleting a
   resume never deletes past interviews). Additive and nullable — nothing existing changed.
2. **`Resume.analysis` was missing.** The Get Resume response documents a structured
   `analysis` object (`skills`, `experienceYears`, `projects`), but the original schema only
   had `extractedText`. Added `analysis Json?` so Gemini's analysis is persisted once
   (`PROCESSING → PROCESSED`) instead of being recomputed on every `GET /resume`. Same
   additive/nullable treatment.
3. **`answer.keywords` is not in the schema — and doesn't need to be.** Re-reading the
   Postman examples closely: `keywords` only appears in Submit Answer's `evaluation` object,
   never in a persisted `answer` object (the "answer" sub-object in both Submit Answer and Get
   Interview Details only ever shows `id/text/score/feedback`). So this isn't actually a gap —
   keywords are returned once, live from Gemini's evaluation, and never persisted. No schema
   change needed here.
4. **`Interview.QuestionCount` is required but the Create Interview request doesn't provide
   it.** Treated as a server-side default (`DEFAULT_QUESTION_COUNT = 5` in `config/env.ts`,
   matching the `questionCount: 5` shown in the Postman example response) rather than
   something the client controls.
5. **Credit cost per interview isn't stated explicitly anywhere**, but the sample transaction
   data (`"amount": -1, "type": "USAGE", "description": "Interview: <id>"`) implies 1 credit
   is deducted per interview at creation time. Implemented that way, with the cost
   configurable via `CREDITS_PER_INTERVIEW` rather than hardcoded.
6. **Interview mode has no Prisma enum** (`Interview.mode` is a plain `String`). The ten modes
   returned by `GET /interview/modes` are defined once, in code
   (`interview-modes/interview-mode.service.ts`), matching the Postman example exactly, and
   reused to validate `mode` on interview creation. If you want real enum-level enforcement in
   Postgres, that list is the place to promote into a Prisma `enum`.
7. **`Creditwallet` is a model name with only its first letter capitalized** — Prisma's
   client property for it is `prisma.creditwallet` (all lowercase), not `prisma.creditWallet`.
   Worth knowing if you extend this code — it's easy to typo.

Nothing else about the schema was changed. No fields were renamed, no relations were removed,
and no other models were added.

## Notes on the provided `package.json`

Every dependency and version in the file you provided resolved against the real npm registry
as-is — including `prisma@7.8.0`+, `express@5.2.1`, `firebase-admin@14.1.0`+, and the rest —
so nothing was downgraded or swapped out.

One dependency was **added**: **`express-rate-limit`**. The brief explicitly calls for rate
limiting as part of production security, and nothing in the provided dependency list covers
it, so a small, well-maintained addition was made rather than hand-rolling a limiter or
skipping the requirement.

A second dependency was added after the initial delivery: **`@supabase/supabase-js`**, for resume file storage. 
## What wasn't (and couldn't be) verified end-to-end here

This sandbox's network is restricted to package registries — there's no live Postgres
instance, and no real Firebase, Gemini, or Razorpay credentials to call. So the following are
implemented and internally consistent with the API contract and Prisma schema, but not
exercised against live services:

- `prisma generate` / `prisma migrate dev` (blocked: can't reach Prisma's engine-binary CDN)
- A full `tsc` build (depends on the generated Prisma client existing first)
- Live Firebase ID token verification, live Gemini calls, live Razorpay order/webhook calls

Everything else — the request/response shapes, ownership checks, transaction boundaries,
validation, and error handling — was written and reviewed directly against the Postman
collection and Prisma schema. Once you run `npm install && npx prisma generate` in a normal
environment, `npm run typecheck` is the fastest way to catch anything that slipped through.
