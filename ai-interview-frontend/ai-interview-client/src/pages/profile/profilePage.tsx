import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { Loader2, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { usersApi } from '@/lib/api/users'
import { ApiError } from '@/lib/api/client'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/utils'

const profileSchema = z.object({
  name: z.string().trim().min(2, 'Name must be at least 2 characters').max(80),
})

type ProfileForm = z.infer<typeof profileSchema>

export default function ProfilePage() {
  const { user, logout, isLoggingOut } = useAuth()
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '' },
  })

  useEffect(() => {
    if (user) reset({ name: user.name })
  }, [user, reset])

  const updateProfile = useMutation({
    mutationFn: (payload: ProfileForm) => usersApi.updateProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(['profile'], updated)
      toast.success('Profile updated successfully')
      reset({ name: updated.name })
    },
    onError: (error) => {
      toast.error(error instanceof ApiError ? error.message : "Couldn't update your profile.")
    },
  })

  if (!user) return null

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-fg">Profile</h1>
        <p className="mt-1 text-sm text-fg-muted">Manage your account details.</p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-4 pt-5">
          <Avatar name={user.name} src={user.avatarUrl} className="size-14 text-base" />
          <div>
            <p className="text-base font-semibold text-fg">{user.name}</p>
            <p className="text-sm text-fg-muted">{user.email}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-fg-subtle">Member since</p>
            <p className="mt-1 text-sm font-medium text-fg">
              {user.createdAt ? formatDate(user.createdAt) : '—'}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-5">
            <p className="text-xs text-fg-subtle">Credit balance</p>
            <p className="mt-1 font-mono text-sm font-medium text-fg">
              {user.creditWallet?.balance ?? 0} credits
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-4"
            onSubmit={handleSubmit((values) => updateProfile.mutate(values))}
          >
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" invalid={Boolean(errors.name)} {...register('name')} />
              {errors.name && <p className="text-xs text-danger">{errors.name.message}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email} disabled />
              <p className="text-xs text-fg-subtle">Managed by your Google account.</p>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={!isDirty || updateProfile.isPending}>
                {updateProfile.isPending && <Loader2 className="size-4 animate-spin" />}
                Save changes
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="flex items-center justify-between pt-5">
          <div>
            <p className="text-sm font-medium text-fg">Log out</p>
            <p className="text-xs text-fg-subtle">You'll need to sign in again to continue.</p>
          </div>
          <Button variant="destructive" onClick={() => logout()} disabled={isLoggingOut}>
            {isLoggingOut ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <LogOut className="size-4" />
            )}
            Log out
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}