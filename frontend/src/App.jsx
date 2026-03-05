import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Employer pages
import PostJob from './pages/employer/PostJob';
import ManageJobs from './pages/employer/ManageJobs';
import EditJob  from './pages/employer/EditJob';
import EmployerWallet from './pages/employer/EmployerWallet';
import ReviewApplications from './pages/employer/ReviewApplications';
import SearchWorkers from './pages/employer/SearchWorkers';
import HelpSupport from './pages/employer/HelpSupport';
import Messaging  from './pages/employer/Messaging';

// Worker pages
import WorkerWallet       from './pages/worker/WorkerWallet';

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default redirect to employer jobs */}
        <Route path="/" element={<Navigate to="/employer/jobs" />} />

        {/* Employer job routes */}
        <Route path="/employer/jobs"             element={<ManageJobs />}         />
        <Route path="/employer/jobs/new"         element={<PostJob />}            />
        <Route path="/employer/jobs/edit/:jobId" element={<EditJob />}            />

        {/* Employer application routes */}
        <Route path="/employer/applications"     element={<ReviewApplications />} />

        {/* Employer wallet route */}
        <Route path="/employer/wallet"           element={<EmployerWallet />}     />

        {/* Employer workers route */}
        <Route path="/employer/workers"          element={<SearchWorkers />}      />

        {/* Employer help and support route */}
        <Route path="/employer/help"             element={<HelpSupport />}        />

        {/* Employer messaging route */}
        <Route path="/employer/messages"         element={<Messaging />}          />

        {/* Worker wallet route */}
        <Route path="/worker/wallet"             element={<WorkerWallet />}       />

        {/* Catch all — redirect to employer jobs */}
        <Route path="*" element={<Navigate to="/employer/jobs" />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;