import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Sidebar from './components/layout/Sidebar';

// Import your page components (You will create these in src/pages/)
import WorkerDashboard from './pages/worker/WorkerDashboard';
// Note: Assuming you create these files next based on your previous codes

const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
    <Header />
    <div className="flex flex-1">
      <Sidebar />
      <main className="flex-1 bg-gray-50 p-6">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>
    </div>
    <Footer />
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        {/* Auth Routes (No Header/Sidebar) */}
        <Route path="/login" element={<div className="flex items-center justify-center min-h-screen bg-gray-50">Login Page Content</div>} />

        {/* Protected Routes (With Header/Sidebar) */}
        <Route path="/worker/dashboard" element={
          <MainLayout>
            <WorkerDashboard />
          </MainLayout>
        } />

        <Route path="/worker/profile" element={
          <MainLayout>
            <div className="bg-white p-6 rounded-xl border">Worker Profile Page</div>
          </MainLayout>
        } />

        {/* Redirects */}
        <Route path="/" element={<Navigate to="/worker/dashboard" />} />
      </Routes>
    </Router>
  );
}

export default App;