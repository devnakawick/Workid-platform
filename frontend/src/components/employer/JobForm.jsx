import { useState } from 'react';
import { FileText, Wallet, MapPin, Banknote, Clock, Users, ClipboardList, Plus, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
import { aiService } from '../../services/aiService';
import { Sparkles, Loader2 } from 'lucide-react';
// Backend-compatible categories
const categories = [
  'plumbing', 'electrical', 'carpentry',
  'masonry', 'painting', 'gardening',
  'cleaning', 'driving', 'general_labor', 'other'
];

const JobForm = ({
  initialData = {
    title: '',
    description: '',
    category: '',
    customCategory: '',
    location: '',
    city: '',
    district: '',
    salary: '',
    salaryPeriod: 'fixed',
    duration: '',
    urgency: 'medium',
    workersNeeded: 1,
    requirements: []
  },
  onSubmit,
  submitButtonText,
  loading = false,
  onCancel
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialData);
  const [requirementInput, setRequirementInput] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [predictingWage, setPredictingWage] = useState(false);
  const [extractingSkills, setExtractingSkills] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const addRequirement = () => {
    const requirement = requirementInput.trim();

    if (!requirement) {
      toast.error(t('postJob.validation.reqEmpty', 'Requirement cannot be empty'));
      return;
    }

    if (requirement.length < 3) {
      toast.error(t('postJob.validation.reqMin', 'Requirement too short'));
      return;
    }

    if (formData.requirements.includes(requirement)) {
      toast.error(t('postJob.validation.reqExists', 'Requirement already added'));
      return;
    }

    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, requirement]
    }));

    setRequirementInput('');
    toast.success(t('postJob.success.reqAdded', 'Requirement added'));
  };

  const removeRequirement = (requirement) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r !== requirement)
    }));
    toast.success(t('postJob.success.reqRemoved', 'Requirement removed'));
  };

  const handlePredictWage = async () => {
    if (!formData.title || !formData.category) {
      toast.error(t('postJob.ai.wageError', 'Please enter a job title and category first.'));
      return;
    }
    setPredictingWage(true);
    try {
      const categoryToUse = formData.category === 'other' ? formData.customCategory : formData.category;
      const res = await aiService.predictWage({ 
        title: formData.title, 
        category: categoryToUse || 'general_labor', 
        city: formData.city || 'Colombo'
      });
      if (res.data?.predicted_wage) {
        setFormData(prev => ({ ...prev, salary: res.data.predicted_wage.toString() }));
        toast.success(t('postJob.ai.wageSuccess', 'Suggested fair wage applied!'));
      } else {
        toast.error('Prediction failed. Please enter manually.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to predict wage.');
    } finally {
      setPredictingWage(false);
    }
  };

  const handleExtractSkills = async () => {
    if (!formData.description || formData.description.length < 10) {
      toast.error(t('postJob.ai.skillsError', 'Please enter a detailed job description first.'));
      return;
    }
    setExtractingSkills(true);
    try {
      const res = await aiService.extractSkills({ text: formData.description });
      const skills = res.data?.skills || [];
      if (skills.length > 0) {
        // filter out already added skills
        const newSkills = skills.filter(s => !formData.requirements.includes(s));
        setFormData(prev => ({
          ...prev,
          requirements: [...prev.requirements, ...newSkills]
        }));
        toast.success(t('postJob.ai.skillsSuccess', `Extracted ${newSkills.length} new requirements!`));
      } else {
        toast.error('No specific skills found to extract.');
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to extract skills.');
    } finally {
      setExtractingSkills(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Title validation
    if (!formData.title.trim()) {
      errors.title = t('postJob.validation.titleRequired', 'Job title is required');
      isValid = false;
    } else if (formData.title.length < 5) {
      errors.title = t('postJob.validation.titleMin', 'Title must be at least 5 characters');
      isValid = false;
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = t('postJob.validation.descRequired', 'Job description is required');
      isValid = false;
    }

    // Category validation
    if (!formData.category) {
      errors.category = t('postJob.validation.categoryRequired', 'Please select a category');
      isValid = false;
    }

    // Custom category validation
    if (formData.category === 'other') {
      if (!formData.customCategory.trim()) {
        errors.customCategory = t('postJob.validation.customCategoryRequired', 'Please specify the category');
        isValid = false;
      } else if (formData.customCategory.trim().length < 3) {
        errors.customCategory = t('postJob.validation.customCategoryMin', 'Category name too short');
        isValid = false;
      }
    }

    // Location validation
    if (!formData.location.trim()) {
      errors.location = t('postJob.validation.locationRequired', 'Location is required');
      isValid = false;
    }

    // City validation
    if (!formData.city.trim()) {
      errors.city = t('postJob.validation.cityRequired', 'City is required');
      isValid = false;
    }

    // District validation
    if (!formData.district.trim()) {
      errors.district = t('postJob.validation.districtRequired', 'District is required');
      isValid = false;
    }

    // Salary validation
    if (!formData.salary) {
      errors.salary = t('postJob.validation.salaryRequired', 'Salary amount is required');
      isValid = false;
    } else if (formData.salary <= 0) {
      errors.salary = t('postJob.validation.salaryMin', 'Salary must be greater than 0');
      isValid = false;
    } else if (formData.salary < 100) {
      errors.salary = t('postJob.validation.salaryMinAmount', 'Minimum salary is 100 LKR');
      isValid = false;
    }

    // Duration validation
    if (!formData.duration.trim()) {
      errors.duration = t('postJob.validation.durationRequired', 'Duration is required');
      isValid = false;
    }

    // Workers needed validation
    if (!formData.workersNeeded || formData.workersNeeded < 1) {
      errors.workersNeeded = t('postJob.validation.workersRequired', 'At least 1 worker needed');
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('postJob.validation.fixErrors', 'Please fix the errors in the form'));
      return;
    }

    // Map to backend JobCreate schema
    const salaryPeriodMap = {
      'hourly': 'hourly',
      'daily': 'fixed',
      'weekly': 'fixed',
      'monthly': 'fixed',
      'fixed': 'fixed'
    };

    const jobData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category === 'other' ? (formData.customCategory.trim() || 'other') : formData.category,
      location: formData.location.trim(),
      city: formData.city.trim(),
      district: formData.district.trim(),
      budget: Number(formData.salary),
      payment_type: salaryPeriodMap[formData.salaryPeriod] || 'fixed',
      urgency: formData.urgency || 'medium',
      estimated_duration_hours: parseInt(formData.duration) || null,
    };

    onSubmit(jobData);
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
            <h2 className="text-xl font-bold text-gray-900">{t('postJob.basics.title', 'Job Basics')}</h2>
            <p className="text-sm text-gray-600">{t('postJob.basics.subtitle', 'Provide the main details about the job')}</p>
          </div>
          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
            1
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('postJob.basics.jobTitleLabel', 'Job Title')}</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all ${fieldErrors.title
                ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                } focus:outline-none focus:ring-3`}
              placeholder="e.g., Experienced Mason Needed for House Construction"
              maxLength={100}
            />
            {fieldErrors.title && (
              <span className="flex items-start text-red-600 text-sm font-medium mt-2">
                <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                {fieldErrors.title}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('postJob.basics.categoryLabel', 'Category')}</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all ${fieldErrors.category
                ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                } focus:outline-none focus:ring-3`}
            >
              <option value="">{t('postJob.basics.selectCategory', 'Select a Category')}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{t(`postJob.basics.categories.${cat}`, cat.charAt(0).toUpperCase() + cat.slice(1).replace('_', ' '))}</option>
              ))}
            </select>
            {fieldErrors.category && (
              <span className="flex items-start text-red-600 text-sm font-medium mt-2">
                <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                {fieldErrors.category}
              </span>
            )}

            {formData.category === 'other' && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('postJob.basics.customCategory', 'Specify Category')}</label>
                <input
                  type="text"
                  name="customCategory"
                  value={formData.customCategory}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all ${fieldErrors.customCategory
                    ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                    } focus:outline-none focus:ring-3`}
                  placeholder={t('postJob.basics.customCategoryPlaceholder', 'e.g., Tiling')}
                  maxLength={50}
                />
                {fieldErrors.customCategory && (
                  <span className="flex items-start text-red-600 text-sm font-medium mt-2">
                    <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                    {fieldErrors.customCategory}
                  </span>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('postJob.basics.description', 'Job Description')}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`w-full px-4 py-3 border-2 rounded-lg text-base resize-none transition-all ${fieldErrors.description
                ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                } focus:outline-none focus:ring-3`}
              placeholder={t('postJob.basics.descriptionPlaceholder', 'Describe the work to be done...')}
              maxLength={1000}
            />
            <div className="flex justify-between mt-2">
              <button
                type="button"
                onClick={handleExtractSkills}
                disabled={extractingSkills}
                className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 hover:bg-indigo-100 transition-colors disabled:opacity-50"
              >
                {extractingSkills ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Auto-extract Requirements
              </button>
              <p className="text-sm text-gray-600">{t('postJob.basics.charCount', { count: formData.description.length })}</p>
            </div>
            {fieldErrors.description && (
              <span className="flex items-start text-red-600 text-sm font-medium mt-2">
                <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                {fieldErrors.description}
              </span>
            )}
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
            <h2 className="text-xl font-bold text-gray-900">{t('postJob.locationPay.title', 'Location & Pay')}</h2>
            <p className="text-sm text-gray-600">{t('postJob.locationPay.subtitle', 'Set the location and payment details')}</p>
          </div>
          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
            2
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" /> {t('postJob.locationPay.location', 'Job Location')}
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all ${fieldErrors.location
                ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                } focus:outline-none focus:ring-3`}
              placeholder={t('postJob.locationPay.locationPlaceholder', 'Full address e.g. 45 Galle Road, Mount Lavinia')}
              maxLength={500}
            />
            {fieldErrors.location && (
              <span className="flex items-start text-red-600 text-sm font-medium mt-2">
                <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                {fieldErrors.location}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('postJob.locationPay.city', 'City')}
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all ${fieldErrors.city
                  ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                  } focus:outline-none focus:ring-3`}
                placeholder="e.g., Dehiwala"
                maxLength={100}
              />
              {fieldErrors.city && (
                <span className="flex items-start text-red-600 text-sm font-medium mt-2">
                  <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                  {fieldErrors.city}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('postJob.locationPay.district', 'District')}
              </label>
              <input
                type="text"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all ${fieldErrors.district
                  ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                  } focus:outline-none focus:ring-3`}
                placeholder="e.g., Colombo"
                maxLength={100}
              />
              {fieldErrors.district && (
                <span className="flex items-start text-red-600 text-sm font-medium mt-2">
                  <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                  {fieldErrors.district}
                </span>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Banknote className="w-4 h-4 inline mr-1" /> {t('postJob.locationPay.paymentRate', 'Payment Rate')}
            </label>
            <div className={`flex items-center border-2 rounded-lg overflow-hidden transition-all ${fieldErrors.salary
              ? 'border-red-500 focus-within:border-red-600 focus-within:ring-3 focus-within:ring-red-100'
              : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-100'
              }`}>
              <span className="px-4 py-3 bg-gray-50 border-r-2 border-gray-300 font-semibold text-gray-700">{t('common.currency', 'LKR')}</span>
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

              {/* UPDATED DROPDOWN WITH 'PER' PREFIX */}
              <select
                name="salaryPeriod"
                value={formData.salaryPeriod}
                onChange={handleChange}
                className="px-2 py-3 pr-8 border-none outline-none text-base cursor-pointer appearance-none bg-white bg-[length:1.5rem] bg-[position:right_0.5rem_center] bg-no-repeat min-w-[120px]"
              >
                <option value="hourly">{t('postJob.locationPay.periods.hour', 'per Hour')}</option>
                <option value="daily">{t('postJob.locationPay.periods.day', 'per Day')}</option>
                <option value="weekly">{t('postJob.locationPay.periods.week', 'per Week')}</option>
                <option value="monthly">{t('postJob.locationPay.periods.month', 'per Month')}</option>
                <option value="fixed">{t('postJob.locationPay.periods.fixed', 'Fixed Amount')}</option>
              </select>
            </div>
            {fieldErrors.salary && (
              <span className="flex items-start text-red-600 text-sm font-medium mt-2">
                <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                {fieldErrors.salary}
              </span>
            )}
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-600 block">{t('postJob.locationPay.paymentHint', 'Enter the amount you are willing to pay per period')}</span>
              <button
                type="button"
                onClick={handlePredictWage}
                disabled={predictingWage}
                className="text-xs bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 hover:bg-indigo-100 transition-colors disabled:opacity-50"
              >
                {predictingWage ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                Suggest Fair Wage
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                <Clock className="w-4 h-4 inline mr-1" /> {t('postJob.locationPay.duration', 'Estimated Hours')}
              </label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleChange}
                min="1"
                max="240"
                className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all ${fieldErrors.duration
                  ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                  : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                  } focus:outline-none focus:ring-3`}
                placeholder="e.g., 8"
              />
              {fieldErrors.duration && (
                <span className="flex items-start text-red-600 text-sm font-medium mt-2">
                  <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                  {fieldErrors.duration}
                </span>
              )}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('postJob.locationPay.urgency', 'Urgency')}
              </label>
              <select
                name="urgency"
                value={formData.urgency}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all"
              >
                <option value="low">{t('postJob.locationPay.urgencyLow', 'Low')}</option>
                <option value="medium">{t('postJob.locationPay.urgencyMedium', 'Medium')}</option>
                <option value="high">{t('postJob.locationPay.urgencyHigh', 'High')}</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* CARD 3: WORKFORCE  */}
      <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-6 pb-4 border-b-2 border-gray-100">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
            <Users className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">{t('postJob.workforce.title', 'Workforce')}</h2>
            <p className="text-sm text-gray-600">{t('postJob.workforce.subtitle', 'How many workers do you need?')}</p>
          </div>
          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
            3
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" /> {t('postJob.workforce.workersNeeded', 'Workers Needed')}
          </label>
          <input
            type="number"
            name="workersNeeded"
            value={formData.workersNeeded}
            onChange={handleChange}
            min="1"
            max="50"
            className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all ${fieldErrors.workersNeeded
              ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
              : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
              } focus:outline-none focus:ring-3`}
            placeholder={t('postJob.workforce.workersPlaceholder', '1')}
          />
          {fieldErrors.workersNeeded && (
            <span className="flex items-start text-red-600 text-sm font-medium mt-2">
              <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
              {fieldErrors.workersNeeded}
            </span>
          )}
          <span className="text-xs text-gray-600 mt-1 block">
            {t('postJob.workforce.workersHint', 'Enter the number of workers required')}
          </span>
        </div>
      </div>

      {/* CARD 4: REQUIREMENTS  */}
      <div className="bg-white rounded-xl shadow-md p-8 hover:shadow-lg transition-shadow">
        <div className="flex items-center mb-6 pb-4 border-b-2 border-gray-100">
          <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mr-4">
            <ClipboardList className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-900">
              {t('postJob.requirements.title', 'Requirements')}
              <span className="ml-2 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                {t('postJob.requirements.optional', 'Optional')}
              </span>
            </h2>
            <p className="text-sm text-gray-600">{t('postJob.requirements.subtitle', 'List specific skills or tools required')}</p>
          </div>
          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
            4
          </div>
        </div>

        <div>
          {formData.requirements.length > 0 ? (
            <div className="space-y-2 mb-4">
              {formData.requirements.map((req, index) => (
                <div key={index} className="flex items-center gap-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <span className="flex-1 text-sm text-gray-700">{req}</span>
                  <button
                    type="button"
                    onClick={() => removeRequirement(req)}
                    className="p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                    title={t('postJob.requirements.remove', 'Remove')}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm italic">
              {t('postJob.requirements.noRequirements', 'No requirements added yet.')}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={requirementInput}
              onChange={(e) => setRequirementInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addRequirement();
                }
              }}
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg text-base focus:outline-none focus:border-blue-500 focus:ring-3 focus:ring-blue-100 transition-all"
              placeholder={t('postJob.requirements.placeholder', 'e.g., Must have own tools')}
              maxLength={100}
            />
            <button
              type="button"
              onClick={addRequirement}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4.5 h-4.5" />
              {t('postJob.requirements.addButton', 'Add')}
            </button>
          </div>
        </div>
      </div>

      {/* CARD 5: FORM ACTIONS */}
      <div className="bg-white rounded-xl shadow-md p-6 md:p-8 hover:shadow-lg transition-shadow border-2 border-blue-100">
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white rounded-lg text-base md:text-lg font-bold hover:bg-blue-700 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <span className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin mr-3"></span>
                {submitButtonText === t('postJob.postButton', 'Post Job') ? t('postJob.posting', 'Posting...') : t('postJob.updating', 'Updating...')}
              </span>
            ) : (
              submitButtonText
            )}
          </button>

          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-6 md:px-8 py-3 md:py-4 border-2 border-blue-600 bg-white text-blue-600 rounded-lg text-base md:text-lg font-bold hover:bg-blue-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('postJob.cancel', 'Cancel')}
          </button>
        </div>

        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs md:text-sm text-blue-900 leading-relaxed">
            <strong className="font-bold">{t('postJob.tip.label', 'Pro Tip:')}</strong> {t('postJob.tip.text', 'Detailed job descriptions attract better candidates.')}
          </p>
        </div>
      </div>

    </form>
  );
};

export default JobForm;