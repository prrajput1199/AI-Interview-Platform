import { api } from './client'
import type { User } from '@/types/user'

export const usersApi = {
  getProfile: () => api.get<User>('/api/v1/users/profile'),
  updateProfile: (payload: { name: string }) =>
    api.patch<User>('/api/v1/users/profile', payload),
}