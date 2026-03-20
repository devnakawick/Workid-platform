import { Toaster } from "sonner";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider, useAuth } from './lib/AuthContext';
import { LanguageProvider } from './lib/LanguageContext';
import { SocketProvider } from './lib/SocketContext';

// Components
import LanguageSwitcher from './components/common/LanguageSwitcher';
import PageNotFound from './lib/PageNotFound'; 
import Layout from './Layout';

// Pages
import LandingPage from './pages/land/LandingPage';
import Login from './pages/auth/Login';
import SignupSelection from './pages/auth/SignupSelection'; 
import SignupEmployer from './pages/auth/SignupEmployer';   
import SignupWorker from './pages/auth/SignupWorker';       
import OTPVerification from './pages/auth/OtpVerification'; 

// Dashboard Pages - Commented out the ones causing errors
import WorkerDashboard from './pages/worker/WorkerDashboard'; 
import EmployerDashboard from './pages/employer/EmployerDashboard';
// import Messages from './pages/worker/Messages'; // <--- THIS WAS THE ERROR

function PrivateRoute({ children }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SocketProvider>
          <Router>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignupSelection />} />
              <Route path="/signup-employer" element={<SignupEmployer />} />
              <Route path="/signup-worker" element={<SignupWorker />} />
              <Route path="/verify-otp" element={<OTPVerification />} />

              {/* Protected Routes */}
              <Route path="/worker/dashboard" element={
                <PrivateRoute>
                  <Layout currentPageName="Dashboard"><WorkerDashboard /></Layout>
                </PrivateRoute>
              } />

              <Route path="/employer/dashboard" element={
                <PrivateRoute>
                  <Layout currentPageName="Dashboard"><EmployerDashboard /></Layout>
                </PrivateRoute>
              } />

              {/* Temporarily disabled until file path is found */}
              {/* <Route path="/messages" element={
                <PrivateRoute>
                  <Layout currentPageName="Messages"><Messages /></Layout>
                </PrivateRoute>
              } /> */}

              <Route path="*" element={<PageNotFound />} />
            </Routes>
            <LanguageSwitcher />
          </Router>
          <Toaster position="top-center" richColors closeButton />
        </SocketProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

export default App;