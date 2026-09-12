import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { applyThemeClass, resolveIsDark, setPreference, type ThemePreference } from '@/store/themeSlice'

export function useTheme() {
  const preference = useAppSelector((state) => state.theme.preference)
  const dispatch = useAppDispatch()

  useEffect(() => {
    applyThemeClass(preference)
    if (preference !== 'system') return
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const listener = () => applyThemeClass('system')
    media.addEventListener('change', listener)
    return () => media.removeEventListener('change', listener)
  }, [preference])

  return {
    preference,
    isDark: resolveIsDark(preference),
    setPreference: (value: ThemePreference) => dispatch(setPreference(value)),
  }
}