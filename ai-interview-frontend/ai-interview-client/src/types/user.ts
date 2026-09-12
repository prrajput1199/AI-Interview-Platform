export interface CreditWallet {
  balance: number
}

export interface User {
  id: string
  email: string
  name: string
  avatarUrl: string | null
  createdAt?: string
  creditWallet?: CreditWallet
}