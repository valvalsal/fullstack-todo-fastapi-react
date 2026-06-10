import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route } from 'react-router'

import { library } from '@fortawesome/fontawesome-svg-core'

import { fab } from '@fortawesome/free-brands-svg-icons'
import { fas } from '@fortawesome/free-solid-svg-icons'
import { far } from '@fortawesome/free-regular-svg-icons'

import './index.css'

import Header from './components/Header'

import Home from './pages/Home'
import EditTodo from './pages/EditTodo'
import CreateTodo from './pages/CreateTodo'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateTodo />} />
        <Route path="/edit/:todoId" element={<EditTodo />} />
      </Routes>
    </Router>
  </StrictMode>,
)

library.add(fab, far, fas)