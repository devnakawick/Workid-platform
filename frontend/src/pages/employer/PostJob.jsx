import { useNavigate } from 'react-router-dom';
import { Briefcase, ArrowLeft } from 'lucide-react';
import MockSidebar from '../../mocks/MockSidebar';
import MockFooter from '../../mocks/MockFooter';

const PostJob = () => {
  const navigate = useNavigate();

  // Ask for confirmation before leaving-prevents accidental data loss
  const handleCancel = () => {
    if (window.confirm('Are you sure? All entered data will be lost.')) {
      navigate('/employer/jobs');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <MockSidebar />

      <div className="flex-1 flex flex-col">
        <main className="flex-1 py-8 px-4 lg:px-8">
          <div className="max-w-4xl mx-auto">

            {/* Page header*/}
            <div className="mb-8">

              {/* Back button */}
              <button
                onClick={handleCancel}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mb-4 group"
              >
                <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back
              </button>

              {/* Page title*/}
              <h1 className="flex items-center text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                <Briefcase className="w-8 h-8 md:w-10 md:h-10 mr-3 md:mr-4 text-blue-600" />
                Post a New Job
              </h1>

              <p className="text-gray-600 text-sm md:text-base">
                Fill in the details to post your job and find the right workers
              </p>
            </div>

          </div>
        </main>
        <MockFooter />
      </div>
    </div>
  );
};


export default PostJob;