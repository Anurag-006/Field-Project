import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from './Layout.tsx'
import Home from './components/Home/Home.tsx'
import Login from './components/Login/Login.tsx'
import Profile from './components/Profile/Profile.tsx'
import { ThemeProvider } from "@/components/theme-provider"

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {      
        path: '/',
        element: <Home />,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/profile',
        element: <Profile />,
      }
    ]
  }
]);


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>,
)