export interface UserProfile {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
  createdAt: string
  creditWallet: { balance: number }
}
