import { useState } from 'react';
import toast from 'react-hot-toast';
import { categories } from '../../mocks/jobData';

const JobForm = ({ 
  initialData = {
    title: '',
    description: '',
    category: '',
    customCategory: '',
    location: '',
    salary: '',
    salaryPeriod: 'daily',
    duration: '',
    workersNeeded: 1,
    requirements: []
  },
  onSubmit,
  submitButtonText = 'Post Job',
  loading = false,
  onCancel
}) => {
  const [formData, setFormData] = useState(initialData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white rounded-xl shadow-md p-8">
        <p className="text-gray-600 text-center">JobForm initialized. Cards coming next...</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button 
          type="submit" 
          disabled={loading}
          className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50"
        >
          {loading ? 'Loading...' : submitButtonText}
        </button>
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default JobForm;