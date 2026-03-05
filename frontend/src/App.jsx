import { Toaster } from "@/components/ui/toaster"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import Layout from './Layout';
import Applications from './pages/Application';
import Badges from './pages/Badges';
import Documents from './pages/Documents';
import Jobs from './pages/Jobs';
import Learning from './pages/Learning';
import Settings from './pages/Settings';

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
      <Route path="/" element={
        <Layout currentPageName="Jobs">
          <Jobs />
        </Layout>
      } />
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
      <Route path="/Learning" element={
        <Layout currentPageName="Learning">
          <Learning />
        </Layout>
      } />
      <Route path="/Settings" element={
        <Layout currentPageName="Settings">
          <Settings />
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
      <Toaster />
    </AuthProvider>
  )
}

export default App
