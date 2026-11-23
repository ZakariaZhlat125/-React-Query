import { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import AdminLayout from './components/layout/AdminLayout';
import PageLoader from './components/PageLoader';
import ProtectedRoute from './components/ProtectedRoute';

// Route-based code splitting: each page becomes its own JS chunk,
// downloaded only when the user opens that page.
const Login = lazy(() => import('./pages/Login'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Users = lazy(() => import('./pages/Users'));
const UserDetails = lazy(() => import('./pages/UserDetails'));
const Posts = lazy(() => import('./pages/Posts'));
const Todos = lazy(() => import('./pages/Todos'));
const Admin = lazy(() => import('./pages/Admin'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Settings uses a NAMED export → lazy needs a { default } object (Worksheet → Bug 5)
const Settings = lazy(() => import('./pages/Settings').then((m) => ({ default: m.Settings })));

export default function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<PageLoader label="Loading page..." />}>
          <Routes>
            {/* Public */}
            <Route path="/login" element={<Login />} />
            <Route path="/unauthorized" element={<Unauthorized />} />

            {/* Any logged-in user */}
            <Route element={<ProtectedRoute />}>
              <Route element={<AdminLayout />}>
                <Route index element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/users/:id" element={<UserDetails />} />
                <Route path="/posts" element={<Posts />} />
                <Route path="/todos" element={<Todos />} />
                <Route path="/settings" element={<Settings />} />

                {/* Admin only (authorization) */}
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <Admin />
                    </ProtectedRoute>
                  }
                />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
  );
}
