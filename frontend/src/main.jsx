import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router'

import { library } from '@fortawesome/fontawesome-svg-core'

import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

import './index.css'

import Header from './components/Header'

import { AuthProvider } from './contexts/AuthContext'

import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Login from './pages/Login'
import EditTodo from './pages/EditTodo'
import CreateTodo from './pages/CreateTodo'

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error("No #root element. App can't be loaded")
}

createRoot(rootElement).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Header />
        <Routes>
          <Route path="/login" element={<Login />} />
          
          <Route element={<ProtectedRoute />} >
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateTodo />} />
            <Route path="/edit/:todoId" element={<EditTodo />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  </StrictMode>,
)

library.add(fab, far, fas)