import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { store } from '@/store'
import { queryClient } from '@/lib/queryClient'
import App from './App'
import './index.css'
import { AppErrorBoundary } from './components/errors/Errorboundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppErrorBoundary>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <App />
            <Toaster
              position="bottom-right"
              toastOptions={{
                className: '!bg-bg-raised !text-fg !border !border-border !text-sm',
                duration: 4000,
              }}
            />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </AppErrorBoundary>
  </StrictMode>,
)