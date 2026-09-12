export interface ApiSuccess<T> {
  success: true
  data: T
  message?: string
}

export interface ApiFailure {
  success: false
  message: string
  error?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}

export interface Paginated<T> {
  items: T[]
  pagination: Pagination
}