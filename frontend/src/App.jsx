import { Toaster } from "sonner"
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Layout from './Layout';

// Original imports
import WorkerProfile from './pages/worker/WorkerProfile';
import WorkerDashboard from './pages/worker/WorkerDashboard';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import LandingPage from './pages/land/LandingPage';
import Login from './pages/auth/Login';
import SignupEmployer from './pages/auth/SignupEmployer';
import SignupWorker from './pages/auth/SignupWorker';
import SignupSelection from './pages/auth/SignupSelection';
import Applications from './pages/Application';
import Badges from './pages/Badges';
import Documents from './pages/Documents';
import Jobs from './pages/Jobs';
import Learning from './pages/Learning';
import Settings from './pages/Settings';
import Notifications from './pages/Notifications';
import Messages from './pages/Messages';
import OtpVerification from './pages/auth/OtpVerification';

// New employer pages from feature branch
import PostJob from './pages/employer/PostJob';
import ManageJobs from './pages/employer/ManageJobs';
import EditJob from './pages/employer/EditJob';
import EmployerWallet from './pages/employer/EmployerWallet';
import ReviewApplications from './pages/employer/ReviewApplications';
import SearchWorkers from './pages/employer/SearchWorkers';
import HelpSupport from './pages/employer/HelpSupport';

// New worker pages from feature branch
import WorkerWallet from './pages/worker/WorkerWallet';
import WorkerHelpSupport from './pages/worker/WorkerHelpSupport';
import LanguageSwitcher from './components/common/LanguageSwitcher';
import WorkerCurrentJobsPage from './pages/worker/WorkerCurrentJobsPage';
import WorkerJobDetailsPage from './pages/worker/WorkerJobDetailsPage';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings } = useAuth();

  // Show loading spinner while checking app public settings or auth
  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Render the main app
  return (
    <Routes>
      {/* Original routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/Applications" element={
        <Layout currentPageName="Applications">
          <Applications />
        </Layout>
      } />
      <Route path="/Badges" element={
        <Layout currentPageName="Badges">
          <Badges />
        </Layout>
      } />
      <Route path="/Documents" element={
        <Layout currentPageName="Documents">
          <Documents />
        </Layout>
      } />
      <Route path="/Jobs" element={
        <Layout currentPageName="Jobs">
          <Jobs />
        </Layout>
      } />
      <Route path="/worker/dashboard" element={
        <Layout currentPageName="Dashboard">
          <WorkerDashboard />
        </Layout>
      } />
      <Route path="/employer/dashboard" element={
        <Layout currentPageName="Dashboard">
          <EmployerDashboard />
        </Layout>
      } />
      <Route path="/Learning" element={
        <Layout currentPageName="Learning">
          <Learning />
        </Layout>
      } />
      <Route path="/Profile" element={
        <Layout currentPageName="Profile">
          <WorkerProfile />
        </Layout>
      } />
      <Route path="/Settings" element={
        <Layout currentPageName="Settings">
          <Settings />
        </Layout>
      } />
      <Route path="/Notifications" element={
        <Layout currentPageName="Notifications">
          <Notifications />
        </Layout>
      } />
      <Route path="/Messages" element={
        <Layout currentPageName="Messages">
          <Messages />
        </Layout>
      } />
      <Route path="/landing" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupSelection />} />
      <Route path="/signup-employer" element={<SignupEmployer />} />
      <Route path="/signup-worker" element={<SignupWorker />} />
      <Route path="/verify-otp" element={<OtpVerification />} />

      {/* New employer routes from feature branch */}
      <Route path="/employer/jobs" element={
        <Layout currentPageName="Manage Jobs">
          <ManageJobs />
        </Layout>
      } />
      <Route path="/employer/jobs/new" element={
        <Layout currentPageName="Post Job">
          <PostJob />
        </Layout>
      } />
      <Route path="/employer/jobs/edit/:jobId" element={
        <Layout currentPageName="Edit Job">
          <EditJob />
        </Layout>
      } />
      <Route path="/employer/applications" element={
        <Layout currentPageName="Review Applications">
          <ReviewApplications />
        </Layout>
      } />
      <Route path="/employer/wallet" element={
        <Layout currentPageName="Employer Wallet">
          <EmployerWallet />
        </Layout>
      } />
      <Route path="/employer/workers" element={
        <Layout currentPageName="Search Workers">
          <SearchWorkers />
        </Layout>
      } />
      <Route path="/employer/help" element={
        <Layout currentPageName="Help Support">
          <HelpSupport />
        </Layout>
      } />

      {/* New worker routes from feature branch */}
      <Route path="/worker/wallet" element={
        <Layout currentPageName="Worker Wallet">
          <WorkerWallet />
        </Layout>
      } />
      <Route path="/worker/current-jobs" element={
        <Layout currentPageName="Current Jobs">
          <WorkerCurrentJobsPage />
        </Layout>
      } />
      <Route path="/worker/job-details/:jobId" element={
        <Layout currentPageName="Job Progress">
          <WorkerJobDetailsPage />
        </Layout>
      } />

      <Route path="/worker/support" element={
        <Layout currentPageName="Help & Support">
          <WorkerHelpSupport />
        </Layout>
      } />

      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AuthenticatedApp />
      </Router>
      <Toaster position="top-center" richColors closeButton />
      <LanguageSwitcher />
    </AuthProvider>
  )
}

export default App