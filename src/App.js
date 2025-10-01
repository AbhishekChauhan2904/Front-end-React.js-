import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';

function PrivateRoute({ children, roles }) {
  const { user } = useAuth();
  if(!user) return <Navigate to='/login' replace />;
  if(roles && !roles.includes(user.role)) return <div style={{padding:20}}>Access denied</div>;
  return children;
}

export default function App(){
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/teacher" element={
            <PrivateRoute roles={['teacher']}><TeacherDashboard/></PrivateRoute>
          } />
          <Route path="/student" element={
            <PrivateRoute roles={['student']}><StudentDashboard/></PrivateRoute>
          } />
          <Route path="*" element={<Navigate to='/login' replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
