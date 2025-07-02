// src/app/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from '../../context/AuthContext';
import "../../styles/global.css";
import { HomePage, Dashboard, QRPage, PrivateRoute, Login, Logout, Milestone, Register, Share } from '../index.js';
function App() {

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<Register />} />
          <Route path="/share/:canPar/:bottlePar" element={<Share />} />
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/qr" element={<QRPage />} />
            <Route path="/milestone" element={<Milestone />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;