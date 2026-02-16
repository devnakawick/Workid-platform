import { useState } from 'react';
import { FileText, Wallet, MapPin, Banknote, Clock, Users } from 'lucide-react';
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
      
      {/* CARD 1: JOB BASICS  */}
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
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Title *</label>
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
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
            
            {formData.category === 'Other' && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Category *</label>
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

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Job Description *</label>
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
              <p className="text-sm text-gray-600 mt-1">{formData.description.length} / 1000 characters</p>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 2: LOCATION & PAY  */}
      <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-6 pb-4 border-b-2 border-gray-100">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
            <Wallet className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Location & Pay</h2>
            <p className="text-sm text-gray-600">Where & how much?</p>
          </div>
          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
            2
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" /> Location *
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all"
              placeholder="e.g., Colombo, Sri Lanka"
              maxLength={100}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Banknote className="w-4 h-4 inline mr-1" /> Payment Rate *
            </label>
            <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-100 transition-all">
              <span className="px-4 py-3 bg-gray-50 border-r-2 border-gray-300 font-semibold text-gray-700">LKR</span>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                min="100"
                max="1000000"
                className="flex-1 px-4 py-3 border-none outline-none text-base [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                placeholder="2500"
              />
              <span className="px-2 text-gray-400 text-xl font-light">/</span>
              <select
                name="salaryPeriod"
                value={formData.salaryPeriod}
                onChange={handleChange}
                className="px-2 py-3 pr-8 border-none outline-none text-base cursor-pointer appearance-none bg-white bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGZpbGw9Im5vbmUiIHZpZXdCb3g9IjAgMCAyNCAyNCIgc3Ryb2tlPSIjNmI3MjgwIj48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMiIgZD0iTTE5IDlsLTcgNy03LTciPjwvcGF0aD48L3N2Zz4=')] bg-[length:1.5rem] bg-[position:right_0.5rem_center] bg-no-repeat min-w-[120px]"
              >
                <option value="hourly">hour</option>
                <option value="daily">day</option>
                <option value="weekly">week</option>
                <option value="monthly">month</option>
                <option value="fixed">fixed</option>
              </select>
            </div>
            <span className="text-xs text-gray-600 mt-1 block">Enter the amount and select payment period</span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" /> Duration *
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all"
              placeholder="e.g., 2 months, 3 weeks, 10 days"
              maxLength={50}
            />
          </div>
        </div>
      </div>

      {/* CARD 3: WORKFORCE */}
      <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-6 pb-4 border-b-2 border-gray-100">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">Workforce</h2>
            <p className="text-sm text-gray-600">How many people do you need?</p>
          </div>
          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
            3
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" /> Workers Needed *
          </label>
          <input
            type="number"
            name="workersNeeded"
            value={formData.workersNeeded}
            onChange={handleChange}
            min="1"
            max="50"
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all"
            placeholder="Number of workers"
          />
          <span className="text-xs text-gray-600 mt-1 block">
            How many workers do you need for this job?
          </span>
        </div>
      </div>

      {/* Temporary actions */}
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