import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { QueryClientProvider } from '@tanstack/react-query'
import { Provider } from 'react-redux'
import { store } from './store/index.ts'
import { queryClient } from './lib/react-query.ts';
import { RouterProvider } from 'react-router-dom'
import { router } from './routes.tsx'
// import './styles/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
       <QueryClientProvider client = {queryClient}>
           <RouterProvider router ={router}/>
       </QueryClientProvider>
    </Provider>
  </StrictMode>,
)
