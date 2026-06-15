import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router';

import './index.css';

import { AuthProvider } from './contexts/AuthContext';

import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import EditTodo from './pages/EditTodo';
import CreateTodo from './pages/CreateTodo';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("No #root element. App can't be loaded");
}

createRoot(rootElement).render(
  <StrictMode>
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<CreateTodo />} />
            <Route path="/edit/:todoId" element={<EditTodo />} />
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  </StrictMode>,
);
