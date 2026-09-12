import { api } from './client'
import type { User } from '@/types/user'

export const authApi = {
  loginWithGoogle: (idToken: string) =>
    api.post<{ user: User }>('/auth/google', { idToken }),
  logout: () => api.post<null>('/api/v1/auth/logout'),
}