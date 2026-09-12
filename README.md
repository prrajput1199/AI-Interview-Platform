# Loopcoach — AI Interview Platform Frontend

A production frontend for the AI Interview Platform API — built with React 19, TypeScript,
Vite, Tailwind CSS v4, TanStack Query, and Redux Toolkit. It integrates end-to-end with the
provided backend: Google/Firebase auth, resume upload and analysis, AI-generated mock
interviews with instant scoring, PDF reports, Razorpay credit purchases, and performance
analytics.

## Features

- **Marketing landing page** — hero, features, how-it-works, live interview-mode list, credit
  system explainer, final CTA
- **Google sign-in** via Firebase, backed by the platform's HTTP-only cookie session
- **Resume management** — drag-and-drop PDF upload, processing/processed/failed states,
  skills & project analysis, delete with confirmation
- **Interview creation wizard** — mode → resume → title → review
- **Interview session** — AI question generation, one-question-at-a-time answering, instant
  AI scoring and feedback, resumable mid-interview
- **Interview report** — overall score, strengths/weaknesses/suggestions, per-question
  breakdown, PDF download
- **Interview history** — paginated, responsive table/cards
- **Analytics dashboard** — KPI cards, score trend chart, question performance chart,
  strengths/weaknesses
- **Credits** — balance, Razorpay checkout for purchasing credits, transaction history
- **Profile** — view and edit name, credit balance, logout
- **Light / dark / system theme**, persisted
- Loading, empty, and error states throughout; no invented or fake data — every screen
  reflects real API responses

## Tech stack

| Concern | Library |
| --- | --- |
| Framework | React 19 + TypeScript + Vite |
| Styling | Tailwind CSS v4 (custom design tokens, CSS-var based light/dark theme) |
| Server state | TanStack Query |
| Client state | Redux Toolkit (session + theme only) |
| Routing | React Router v7 |
| Forms | React Hook Form + Zod |
| HTTP | Axios (cookie-based sessions via `withCredentials`) |
| Auth | Firebase Auth (Google popup) |
| Charts | Recharts |
| UI primitives | Radix UI (Dialog, DropdownMenu, Select, Tabs, Label) + custom components |
| Payments | Razorpay Checkout (client script, loaded on demand) |

## Getting started

```bash
npm install
cp .env.example .env
# edit .env with your backend URL and Firebase config
npm run dev
```

The app runs at `http://localhost:5173` by default and expects the backend at the URL set
in `VITE_API_URL` (defaults to `http://localhost:5000`).

## Environment variables

See `.env.example`. All variables are read at build time via Vite's `import.meta.env` and
must be prefixed `VITE_`.

| Variable | Required | Notes |
| --- | --- | --- |
| `VITE_API_URL` | Yes | Base URL of the backend API, no trailing slash |
| `VITE_FIREBASE_API_KEY` | For Google sign-in | From your Firebase project settings |
| `VITE_FIREBASE_AUTH_DOMAIN` | For Google sign-in | e.g. `your-project.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | For Google sign-in | |
| `VITE_FIREBASE_APP_ID` | For Google sign-in | |

If the Firebase variables are left empty, the app still runs — the "Continue with Google"
button is disabled with an explanatory note instead of throwing at runtime.

## Scripts

```bash
npm run dev       # start the dev server
npm run build     # type-check (tsc -b) and build for production
npm run lint      # run ESLint
npm run preview   # preview the production build locally
```

## Authentication flow

1. User clicks **Continue with Google** → Firebase popup sign-in.
2. The Firebase ID token is exchanged with the backend: `POST /api/v1/auth/google`.
3. The backend sets an **HTTP-only** session cookie (`interview_token`). The frontend never
   reads or stores this token — every request is sent with `axios`'s `withCredentials: true`
   so the browser attaches the cookie automatically.
4. On load, the app calls `GET /api/v1/users/profile` to check whether a session already
   exists (`useSessionBootstrap`). A 401 anywhere in the app clears local session state and
   redirects to `/login`.

## Razorpay setup

The **create order → checkout → verify** flow is fully client-driven but never touches
Razorpay secrets:

1. `POST /api/v1/payments/create-order` returns an `orderId`, `amount`, `currency`, and a
   **public** `keyId`.
2. The Razorpay checkout script is loaded on demand (`checkout.razorpay.com/v1/checkout.js`)
   and opened with those values.
3. On success, the frontend calls `POST /api/v1/payments/verify` with the Razorpay response
   — verification and signature checking happen server-side.
4. The Razorpay **webhook** (`POST /api/v1/payments/webhook`) is a server-to-server endpoint
   and is intentionally never called from this frontend.

No Razorpay secret key is ever present in this codebase.

## Project structure

```
src/
  components/
    ui/            Reusable primitives (Button, Card, Dialog, Tabs, Select, ...)
    layout/         AppShell, Sidebar, MobileNav, ProtectedRoute
    navigation/     Logo, nav config, ThemeToggle
    marketing/      Landing page sections
    dashboard/      Dashboard-only widgets
    interview/      Interview creation/session/report widgets
    resume/         Resume upload & analysis widgets
    payments/       Credits purchase & transaction widgets
    charts/         Recharts wrappers themed for light/dark
    feedback/       AI loading + evaluation reveal states
    errors/         ErrorState, AppErrorBoundary
    empty-states/   EmptyState
  hooks/            TanStack Query hooks per domain (auth, interviews, resume, payments, analytics)
  lib/
    api/            Axios client + one module per backend resource
    firebase.ts     Firebase init + Google sign-in
    razorpay.ts     Razorpay script loader + types
    queryClient.ts  TanStack Query client config
    utils.ts        cn(), formatDate(), formatScore(), initialsFor()
  pages/            Route-level components, grouped by feature
  store/            Redux Toolkit slices (auth session, theme preference)
  types/            Shared TypeScript types matching the API contract exactly
```

## Notes on the provided `package.json`

The dependency versions in the original `package.json` you supplied (e.g. `react ^19.2.8`,
`vite ^8.2.0`, `typescript ~6.0.2`, `eslint ^10`, `@shadcn/ui`, `@base-ui/react`,
`lucide-react ^1.31.0`, `react-pdf ^10.4.1`) don't exist on the npm registry as published —
they read like placeholder/future version numbers. To keep the same stack and get a
project that actually installs and runs, this build uses the closest real, mutually
compatible versions of the same libraries (see `package.json`). A few packages were
dropped because they weren't needed for what was built:

- **`@shadcn/ui`** — shadcn/ui components are copy-pasted source, not consumed as an npm
  dependency; this project ships its own small Radix-based primitive set instead
  (`src/components/ui`).
- **`@base-ui/react`** — not used; Radix UI primitives cover every interactive component
  needed (Dialog, DropdownMenu, Select, Tabs, Label).
- **`react-pdf`** — not needed; the report PDF is fetched as a blob and downloaded directly
  rather than rendered in-browser.

If you'd like the report PDF rendered inline instead of downloaded, or a different
component library wired in, that's a small follow-up change.

## Known API-contract notes

- `GET /api/v1/resume` returns a 404-style error when the user has no resume yet. The
  frontend treats that specific case as an empty state (prompting upload) and treats any
  other error as a real failure with a retry action.
- `GET /api/v1/interview/modes` is documented as requiring the auth cookie; it's called from
  the public landing page too so anonymous visitors see the list of interview tracks. If it
  fails for a signed-out visitor, the landing page falls back to the same static mode list
  documented in the API collection (not fabricated data) so the section still renders.
- Credits are assumed to cost 1 credit per interview based on the sample transaction data
  in the API collection; no other pricing logic is invented — displayed amounts, currency,
  and order details always come directly from the backend response.
