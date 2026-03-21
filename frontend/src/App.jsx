import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Providers
import { AuthProvider, useAuth } from './lib/AuthContext';
import { SocketProvider } from './lib/SocketContext';
import { LanguageProvider } from './lib/LanguageContext';
import Layout from './Layout.jsx';

// Landing
import LandingPage from './pages/land/LandingPage';

// Legal
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';

// Auth
import Login from './pages/auth/Login';
import SignupSelection from './pages/auth/SignupSelection';
import OTPVerification from './components/auth/OTPVerification';
import OtpVerification from './pages/auth/OtpVerification';
import SignupWorker from './pages/auth/SignupWorker';
import SignupEmployer from './pages/auth/SignupEmployer';

// Worker pages 
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerProfile from './pages/worker/WorkerProfile';
import WorkerWallet from './pages/worker/WorkerWallet';
import WorkerCurrentJobsPage from './pages/worker/WorkerCurrentJobsPage';
import WorkerHelpSupport from './pages/worker/WorkerHelpSupport';
import WorkerJobDetailsPage from './pages/worker/WorkerJobDetailsPage';
import Applications from './pages/Application';
import Badges from './pages/Badges';
import Documents from './pages/Documents';
import Jobs from './pages/Jobs';
import Learning from './pages/Learning';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';

// Employer pages 
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerProfile from './pages/employer/EmployerProfile';
import EmployerWallet from './pages/employer/EmployerWallet';
import PostJob from './pages/employer/PostJob';
import EditJob from './pages/employer/EditJob';
import ManageJobs from './pages/employer/ManageJobs';
import ReviewApplications from './pages/employer/ReviewApplications';
import SearchWorkers from './pages/employer/SearchWorkers';
import HelpSupport from './pages/employer/HelpSupport';

function PrivateRoute({ children }) {
  const { user, isLoading } = useAuth();

  console.log('PrivateRoute check - isLoading:', isLoading, 'user:', user);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignupSelection />} />
      <Route path="/signup" element={<SignupSelection />} />
      <Route path="/verify-otp" element={<OtpVerification />} />
      <Route path="/signup-worker" element={<SignupWorker />} />
      <Route path="/signup-employer" element={<SignupEmployer />} />
      <Route path="/terms" element={<TermsOfService />} />
      <Route path="/privacy" element={<PrivacyPolicy />} />

      {/* Worker Routes */}
      <Route path="/worker/dashboard" element={<PrivateRoute><Layout><WorkerDashboard /></Layout></PrivateRoute>} />
      <Route path="/worker/profile" element={<PrivateRoute><Layout><WorkerProfile /></Layout></PrivateRoute>} />
      <Route path="/worker/wallet" element={<PrivateRoute><Layout><WorkerWallet /></Layout></PrivateRoute>} />
      <Route path="/worker/current-jobs" element={<PrivateRoute><Layout><WorkerCurrentJobsPage /></Layout></PrivateRoute>} />
      <Route path="/worker/help" element={<PrivateRoute><Layout><WorkerHelpSupport /></Layout></PrivateRoute>} />
      <Route path="/worker/jobs/:id" element={<PrivateRoute><Layout><WorkerJobDetailsPage /></Layout></PrivateRoute>} />
      <Route path="/worker/find-jobs" element={<PrivateRoute><Layout><Jobs /></Layout></PrivateRoute>} />
      <Route path="/worker/applications" element={<PrivateRoute><Layout><Applications /></Layout></PrivateRoute>} />
      <Route path="/worker/active-jobs" element={<PrivateRoute><Layout><WorkerCurrentJobsPage /></Layout></PrivateRoute>} />
      <Route path="/worker/earnings" element={<PrivateRoute><Layout><WorkerWallet /></Layout></PrivateRoute>} />
      <Route path="/worker/messages" element={<PrivateRoute><Layout><Messages /></Layout></PrivateRoute>} />
      <Route path="/worker/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
      <Route path="/worker/learning" element={<PrivateRoute><Layout><Learning /></Layout></PrivateRoute>} />
      <Route path="/worker/badges" element={<PrivateRoute><Layout><Badges /></Layout></PrivateRoute>} />
      <Route path="/worker/documents" element={<PrivateRoute><Layout><Documents /></Layout></PrivateRoute>} />
      <Route path="/worker/notifications" element={<PrivateRoute><Layout><Notifications /></Layout></PrivateRoute>} />

      {/* Employer Routes */}
      <Route path="/employer/dashboard" element={<PrivateRoute><Layout><EmployerDashboard /></Layout></PrivateRoute>} />
      <Route path="/employer/profile" element={<PrivateRoute><Layout><EmployerProfile /></Layout></PrivateRoute>} />
      <Route path="/employer/wallet" element={<PrivateRoute><Layout><EmployerWallet /></Layout></PrivateRoute>} />
      <Route path="/employer/post-job" element={<PrivateRoute><Layout><PostJob /></Layout></PrivateRoute>} />
      <Route path="/employer/edit-job/:id" element={<PrivateRoute><Layout><EditJob /></Layout></PrivateRoute>} />
      <Route path="/employer/jobs" element={<PrivateRoute><Layout><ManageJobs /></Layout></PrivateRoute>} />
      <Route path="/employer/applications" element={<PrivateRoute><Layout><ReviewApplications /></Layout></PrivateRoute>} />
      <Route path="/employer/find-workers" element={<PrivateRoute><Layout><SearchWorkers /></Layout></PrivateRoute>} />
      <Route path="/employer/workers/:id" element={<PrivateRoute><Layout><SearchWorkers /></Layout></PrivateRoute>} />
      <Route path="/employer/messages" element={<PrivateRoute><Layout><Messages /></Layout></PrivateRoute>} />
      <Route path="/employer/settings" element={<PrivateRoute><Layout><Settings /></Layout></PrivateRoute>} />
      <Route path="/employer/help" element={<PrivateRoute><Layout><HelpSupport /></Layout></PrivateRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        {/* <SocketProvider> */}
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        {/* </SocketProvider> */}
      </AuthProvider>
    </LanguageProvider>
  );
}