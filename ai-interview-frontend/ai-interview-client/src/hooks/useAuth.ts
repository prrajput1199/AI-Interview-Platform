import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { authApi } from '@/lib/api/auth'
import { usersApi } from '@/lib/api/users'
import { ApiError, setUnauthorizedHandler } from '@/lib/api/client'
import { signInWithGoogle, signOutOfFirebase } from '@/lib/firebase'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { clearSession, setUser } from '@/store/authSlice'

const PROFILE_KEY = ['profile']

export function useSessionBootstrap() {
  const dispatch = useAppDispatch()

  useEffect(() => {
    setUnauthorizedHandler(() => {
      dispatch(clearSession())
    })
  }, [dispatch])

  const query = useQuery({
    queryKey: PROFILE_KEY,
    queryFn: usersApi.getProfile,
    retry: false,
    refetchOnWindowFocus: false,
  })

  useEffect(() => {
    if (query.isSuccess) {
      dispatch(setUser(query.data))
    } else if (query.isError) {
      dispatch(clearSession())
    }
  }, [query.isSuccess, query.isError, query.data, dispatch])

  return { isLoading: query.isLoading }
}

export function useAuth() {
  const user = useAppSelector((state) => state.auth.user)
  const status = useAppSelector((state) => state.auth.status)
  const dispatch = useAppDispatch()
  const queryClient = useQueryClient()

  const loginMutation = useMutation({
    mutationFn: async () => {
      const idToken = await signInWithGoogle()
      return authApi.loginWithGoogle(idToken)
    },
    onSuccess: ({ user: loggedInUser }) => {
      dispatch(setUser(loggedInUser))
      queryClient.setQueryData(PROFILE_KEY, loggedInUser)
      toast.success(`Welcome back, ${loggedInUser.name.split(' ')[0]}`)
    },
    onError: (error) => {
      const message = error instanceof ApiError ? error.message : (error as Error).message
      if (message && !message.includes('popup-closed')) {
        toast.error(message || 'Sign-in failed. Try again.')
      }
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await Promise.allSettled([authApi.logout(), signOutOfFirebase()])
    },
    onSuccess: () => {
      dispatch(clearSession())
      queryClient.clear()
      toast.success('Logged out')
    },
  })

  return {
    user,
    status,
    isAuthenticated: status === 'authenticated',
    isChecking: status === 'unknown',
    loginWithGoogle: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  }
}