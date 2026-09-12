import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

export type ThemePreference = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'loopcoach-theme'

function readStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') return 'system'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  return 'system'
}

export function resolveIsDark(preference: ThemePreference): boolean {
  if (preference === 'system') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  }
  return preference === 'dark'
}

export function applyThemeClass(preference: ThemePreference) {
  const root = document.documentElement
  root.classList.toggle('dark', resolveIsDark(preference))
}

interface ThemeState {
  preference: ThemePreference
}

const initialState: ThemeState = {
  preference: readStoredPreference(),
}

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    setPreference(state, action: PayloadAction<ThemePreference>) {
      state.preference = action.payload
      window.localStorage.setItem(STORAGE_KEY, action.payload)
      applyThemeClass(action.payload)
    },
  },
})

export const { setPreference } = themeSlice.actions
export default themeSlice.reducer