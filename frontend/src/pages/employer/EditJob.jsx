import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Briefcase, ArrowLeft } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { getJobByIdAPI, updateJobAPI } from '../../mocks/jobData';
import JobForm from '../../components/employer/JobForm';
import MockSidebar from '../../mocks/MockSidebar';
import MockFooter from '../../mocks/MockFooter';

const EditJob = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [jobData, setJobData] = useState(null);

  useEffect(() => {
    fetchJobData();
  }, [jobId]);

  const fetchJobData = async () => {
    setFetching(true);
    try {
      const result = await getJobByIdAPI(jobId);
      if (result.success) {
        setJobData(result.data);
        toast.success('Job data loaded');
      } else {
        toast.error('Job not found');
        navigate('/employer/jobs');
      }
    } catch (error) {
      console.error('Error fetching job:', error);
      toast.error('Failed to load job data');
      navigate('/employer/jobs');
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (updatedJobData) => {
    setLoading(true);
    try {
      const result = await updateJobAPI(jobId, updatedJobData);
      if (result.success) {
        toast.success(result.message);
        setTimeout(() => navigate('/employer/jobs'), 1500);
      } else {
        toast.error(result.error || 'Failed to update job');
      }
    } catch (error) {
      console.error('Error updating job:', error);
      toast.error('An error occurred while updating the job');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure? All changes will be lost.')) {
      navigate('/employer/jobs');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MockSidebar />

      <div className="flex-1 flex flex-col">
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: { background: '#363636', color: '#fff' },
            success: { duration: 3000, iconTheme: { primary: '#10b981', secondary: '#fff' } },
            error:   { duration: 4000, iconTheme: { primary: '#ef4444', secondary: '#fff' } },
          }}
        />

        <main className="flex-1 py-8 px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">

            {fetching ? (
              <div className="flex flex-col items-center justify-center py-32">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                <p className="text-gray-600">Loading job data...</p>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="mb-8">
                  <button
                    onClick={handleCancel}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4 group"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back
                  </button>

                  <h1 className="flex items-center text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                    <Briefcase className="w-8 h-8 md:w-10 md:h-10 mr-3 md:mr-4 text-blue-600" />
                    Edit Job
                  </h1>

                  <p className="text-gray-600 text-sm md:text-base">
                    Update job details and save changes
                  </p>
                </div>

                <JobForm
                  initialData={jobData}
                  onSubmit={handleSubmit}
                  submitButtonText="Update Job"
                  loading={loading}
                  onCancel={handleCancel}
                />
              </>
            )}

          </div>
        </main>

        <MockFooter />
      </div>
    </div>
  );
};

export default EditJob;