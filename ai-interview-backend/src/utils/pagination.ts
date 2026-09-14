export interface PaginationParams {
  page: number
  limit: number
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  pages: number
}

const MAX_LIMIT = 50
const DEFAULT_LIMIT = 10

export function parsePagination(query: Record<string, unknown>): PaginationParams {
  const rawPage = Number(query.page)
  const rawLimit = Number(query.limit)

  const page = Number.isFinite(rawPage) && rawPage > 0 ? Math.floor(rawPage) : 1
  const limit =
    Number.isFinite(rawLimit) && rawLimit > 0
      ? Math.min(Math.floor(rawLimit), MAX_LIMIT)
      : DEFAULT_LIMIT

  return { page, limit }
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  return {
    page,
    limit,
    total,
    pages: Math.max(1, Math.ceil(total / limit)),
  }
}
