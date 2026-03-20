import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './lib/AuthContext';
import { SocketProvider } from './lib/SocketContext';
import { LanguageProvider } from './lib/LanguageContext';

// Landing
import LandingPage from './pages/land/LandingPage';

// Auth 
import Login from './pages/auth/Login';
import SignupSelection from './pages/auth/SignupSelection';
import OTPVerification from './pages/auth/OtpVerification';
import WorkerSignup from './pages/auth/SignupWorker';
import EmployerSignup from './pages/auth/SignupEmployer';

// Worker pages 
import WorkerCurrentJobsPage from './pages/worker/WorkerCurrentJobsPage';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import WorkerHelpSupport from './pages/worker/WorkerHelpSupport';
import WorkerJobDetailsPage from './pages/worker/WorkerJobDetailsPage';
import WorkerProfile from './pages/worker/WorkerProfile';
import WorkerWallet from './pages/worker/WorkerWallet';

// Create missing worker components
const FindJobs = () => <div className="p-4"><h2 className="text-xl font-bold">Find Jobs</h2><p>Page under construction</p></div>;
const JobDetails = () => <div className="p-4"><h2 className="text-xl font-bold">Job Details</h2><p>Page under construction</p></div>;
const MyApplications = () => <div className="p-4"><h2 className="text-xl font-bold">My Applications</h2><p>Page under construction</p></div>;
const ActiveJobs = () => <div className="p-4"><h2 className="text-xl font-bold">Active Jobs</h2><p>Page under construction</p></div>;
const Earnings = () => <div className="p-4"><h2 className="text-xl font-bold">Earnings</h2><p>Page under construction</p></div>;
const WorkerMessages = () => <div className="p-4"><h2 className="text-xl font-bold">Messages</h2><p>Page under construction</p></div>;
const WorkerSettings = () => <div className="p-4"><h2 className="text-xl font-bold">Settings</h2><p>Page under construction</p></div>;
const WorkerHelp = () => <div className="p-4"><h2 className="text-xl font-bold">Help</h2><p>Page under construction</p></div>;

// Employer pages 
import EditJob from './pages/employer/EditJob';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerProfile from './pages/employer/EmployerProfile';
import EmployerWallet from './pages/employer/EmployerWallet';
import HelpSupport from './pages/employer/HelpSupport';
import ManageJobs from './pages/employer/ManageJobs';
import ReviewApplications from './pages/employer/ReviewApplications';
import SearchWorkers from './pages/employer/SearchWorkers';
import PostJob from './pages/employer/PostJob';

// Create missing employer components
const MyJobs = () => <div className="p-4"><h2 className="text-xl font-bold">My Jobs</h2><p>Page under construction</p></div>;
const FindWorkers = () => <div className="p-4"><h2 className="text-xl font-bold">Find Workers</h2><p>Page under construction</p></div>;
const WorkerProfileView = () => <div className="p-4"><h2 className="text-xl font-bold">Worker Profile</h2><p>Page under construction</p></div>;
const EmployerMessages = () => <div className="p-4"><h2 className="text-xl font-bold">Messages</h2><p>Page under construction</p></div>;
const EmployerSettings = () => <div className="p-4"><h2 className="text-xl font-bold">Settings</h2><p>Page under construction</p></div>;
const EmployerHelp = () => <div className="p-4"><h2 className="text-xl font-bold">Help</h2><p>Page under construction</p></div>;

import Applications from './pages/Application';
import Badges from './pages/Badges';
import Documents from './pages/Documents';
import Jobs from './pages/Jobs';
import Learning from './pages/Learning';
import Messages from './pages/Messages';
import Notifications from './pages/Notifications';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Settings from './pages/Settings';
import TermsOfService from './pages/TermsOfService';

function PrivateRoute({ children }) {
  const { user, isLoading, } = useAuth();

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
      {/* Public */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<SignupSelection />} />
      <Route path="/otp" element={<OTPVerification />} />
      <Route path="/signup/worker" element={<WorkerSignup />} />
      <Route path="/signup/employer" element={<EmployerSignup />} />

      {/* Worker */}
      <Route path="/worker/dashboard" element={<PrivateRoute><WorkerDashboard /></PrivateRoute>} />
      <Route path="/worker/profile" element={<PrivateRoute><WorkerProfile /></PrivateRoute>} />
      <Route path="/worker/find-jobs" element={<PrivateRoute><FindJobs /></PrivateRoute>} />
      <Route path="/worker/jobs/:id" element={<PrivateRoute><JobDetails /></PrivateRoute>} />
      <Route path="/worker/applications" element={<PrivateRoute><MyApplications /></PrivateRoute>} />
      <Route path="/worker/active-jobs" element={<PrivateRoute><ActiveJobs /></PrivateRoute>} />
      <Route path="/worker/earnings" element={<PrivateRoute><Earnings /></PrivateRoute>} />
      <Route path="/worker/wallet" element={<PrivateRoute><WorkerWallet /></PrivateRoute>} />
      <Route path="/worker/messages" element={<PrivateRoute><WorkerMessages /></PrivateRoute>} />
      <Route path="/worker/learning" element={<PrivateRoute><Learning /></PrivateRoute>} />
      <Route path="/worker/settings" element={<PrivateRoute><WorkerSettings /></PrivateRoute>} />
      <Route path="/worker/help" element={<PrivateRoute><WorkerHelp /></PrivateRoute>} />

      {/* Employer */}
      <Route path="/employer/dashboard" element={<PrivateRoute><EmployerDashboard /></PrivateRoute>} />
      <Route path="/employer/profile" element={<PrivateRoute><EmployerProfile /></PrivateRoute>} />
      <Route path="/employer/post-job" element={<PrivateRoute><PostJob /></PrivateRoute>} />
      <Route path="/employer/jobs" element={<PrivateRoute><MyJobs /></PrivateRoute>} />
      <Route path="/employer/applications" element={<PrivateRoute><Applications /></PrivateRoute>} />
      <Route path="/employer/find-workers" element={<PrivateRoute><FindWorkers /></PrivateRoute>} />
      <Route path="/employer/workers/:id" element={<PrivateRoute><WorkerProfileView /></PrivateRoute>} />
      <Route path="/employer/wallet" element={<PrivateRoute><EmployerWallet /></PrivateRoute>} />
      <Route path="/employer/messages" element={<PrivateRoute><EmployerMessages /></PrivateRoute>} />
      <Route path="/employer/settings" element={<PrivateRoute><EmployerSettings /></PrivateRoute>} />
      <Route path="/employer/help" element={<PrivateRoute><EmployerHelp /></PrivateRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <AppRoutes />
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}