import { useState } from 'react';
import { FileText } from 'lucide-react';
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
      
      {/* CARD 1: JOB BASICS */}
      <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-6 pb-4 border-b-2 border-gray-100">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Job Basics</h2>
            <p className="text-sm text-gray-600">What is the job?</p>
          </div>
          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
            1
          </div>
        </div>

        <div className="space-y-5">
          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all"
              placeholder="e.g., Experienced Mason Needed for House Construction"
              maxLength={100}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all"
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            
            {/* Custom Category */}
            {formData.category === 'Other' && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Custom Category *
                </label>
                <input
                  type="text"
                  name="customCategory"
                  value={formData.customCategory}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all"
                  placeholder="Enter your custom category"
                  maxLength={50}
                />
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base resize-none focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all"
              placeholder="Describe the job requirements, responsibilities, and what you're looking for in detail..."
              maxLength={1000}
            />
            <div className="flex justify-end">
              <p className="text-sm text-gray-600 mt-1">
                {formData.description.length} / 1000 characters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*  actions */}
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