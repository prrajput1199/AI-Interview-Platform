import axios, { AxiosError, type AxiosRequestConfig } from 'axios'
import type { ApiFailure, ApiResponse } from '@/types/api'

export const API_BASE_URL: string =
  (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:5000'

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
})

export class ApiError extends Error {
  status: number
  payload?: ApiFailure

  constructor(message: string, status: number, payload?: ApiFailure) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.payload = payload
  }
}

/** Listeners the app can register to react globally to auth failures. */
type UnauthorizedHandler = () => void
let onUnauthorized: UnauthorizedHandler | null = null
export function setUnauthorizedHandler(handler: UnauthorizedHandler) {
  onUnauthorized = handler
}

function extractMessage(error: AxiosError<ApiFailure>): string {
  const data = error.response?.data
  if (data && typeof data === 'object' && 'message' in data && data.message) {
    return data.message
  }
  if (error.code === 'ERR_NETWORK') {
    return "Can't reach the server. Check your connection and try again."
  }
  return error.message || 'Something went wrong. Please try again.'
}

async function request<T>(config: AxiosRequestConfig): Promise<T> {
  try {
    const response = await httpClient.request<ApiResponse<T>>(config)
    const body = response.data
    if (body && typeof body === 'object' && 'success' in body && body.success === false) {
      throw new ApiError(body.message, response.status, body)
    }
    return (body as { data: T }).data
  } catch (error) {
    if (axios.isAxiosError<ApiFailure>(error)) {
      const status = error.response?.status ?? 0
      if (status === 401 && onUnauthorized) {
        onUnauthorized()
      }
      throw new ApiError(extractMessage(error), status, error.response?.data)
    }
    throw error
  }
}

export const api = {
  get: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'GET', url }),
  post: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'POST', url, data }),
  patch: <T>(url: string, data?: unknown, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'PATCH', url, data }),
  delete: <T>(url: string, config?: AxiosRequestConfig) =>
    request<T>({ ...config, method: 'DELETE', url }),
}

/** Fetches a binary (PDF) endpoint and returns a Blob, using the same cookie session. */
export async function fetchBlob(url: string): Promise<Blob> {
  try {
    const response = await httpClient.get(url, { responseType: 'blob' })
    return response.data as Blob
  } catch (error) {
    if (axios.isAxiosError<ApiFailure>(error)) {
      const status = error.response?.status ?? 0
      if (status === 401 && onUnauthorized) onUnauthorized()
      throw new ApiError(extractMessage(error), status)
    }
    throw error
  }
}