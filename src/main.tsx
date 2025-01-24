import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { UserAuthContextProvider } from './config/UserAuthContext.tsx'

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <UserAuthContextProvider>
    <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
  </UserAuthContextProvider>
)
