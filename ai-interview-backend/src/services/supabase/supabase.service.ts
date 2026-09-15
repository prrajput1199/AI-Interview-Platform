import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { env } from '@/config/env'
import { ServiceUnavailableError } from '@/utils/errors'
import { logger } from '@/utils/logger'

let client: SupabaseClient

function getSupabaseClient(): SupabaseClient {
  if (!client) {
    client = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    })
  }
  return client
}

class SupabaseStorageService {
  /** Uploads a buffer to Supabase Storage at `destinationPath` and returns that path (not a URL — see getSignedDownloadUrl). */
  async uploadFile(params: {
    buffer: Buffer
    destinationPath: string
    contentType: string
  }): Promise<string> {
    const { buffer, destinationPath, contentType } = params
    const { error } = await getSupabaseClient()
      .storage.from(env.SUPABASE_STORAGE_BUCKET)
      .upload(destinationPath, buffer, { contentType, upsert: true })

    if (error) {
      logger.error({ err: error, destinationPath }, 'Supabase Storage upload failed')
      throw new ServiceUnavailableError('Could not store the uploaded file. Please try again.')
    }
    return destinationPath
  }

  /** Best-effort delete — never throws, since a missing/already-deleted object shouldn't fail the caller's request. */
  async deleteFileQuietly(destinationPath: string): Promise<void> {
    const { error } = await getSupabaseClient()
      .storage.from(env.SUPABASE_STORAGE_BUCKET)
      .remove([destinationPath])

    if (error) {
      logger.warn({ err: error, destinationPath }, 'Supabase Storage delete failed (ignored)')
    }
  }

  /**
   * Generates a short-lived, private download URL for a stored file. Resumes
   * contain personal data, so the bucket stays private and every read gets a
   * fresh signed URL rather than the file being made publicly accessible.
   */
  async getSignedDownloadUrl(destinationPath: string, expiresInMinutes = 15): Promise<string> {
    const { data, error } = await getSupabaseClient()
      .storage.from(env.SUPABASE_STORAGE_BUCKET)
      .createSignedUrl(destinationPath, expiresInMinutes * 60)

    if (error || !data) {
      logger.error({ err: error, destinationPath }, 'Failed to generate signed URL')
      throw new ServiceUnavailableError('Could not generate a download link. Please try again.')
    }
    return data.signedUrl
  }
}

export const supabaseStorageService = new SupabaseStorageService()
