import { initializeApp } from 'firebase/app'
import { GoogleAuthProvider, getAuth, signInWithPopup, signOut } from 'firebase/auth'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string | undefined,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string | undefined,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string | undefined,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string | undefined,
}

const hasFirebaseConfig = Boolean(
  firebaseConfig.apiKey && firebaseConfig.authDomain && firebaseConfig.projectId,
)

const firebaseApp = hasFirebaseConfig ? initializeApp(firebaseConfig) : null
const provider = new GoogleAuthProvider()

/**
 * Runs the Google popup sign-in flow and returns the Firebase ID token,
 * which is then exchanged with our backend at POST /api/v1/auth/google.
 */
export async function signInWithGoogle(): Promise<string> {
  if (!firebaseApp) {
    throw new Error(
      'Firebase is not configured. Set VITE_FIREBASE_* environment variables to enable Google sign-in.',
    )
  }
  const auth = getAuth(firebaseApp)
  const result = await signInWithPopup(auth, provider)
  return result.user.getIdToken()
}

export async function signOutOfFirebase(): Promise<void> {
  if (!firebaseApp) return
  const auth = getAuth(firebaseApp)
  await signOut(auth)
}

export { hasFirebaseConfig }