import { useState } from 'react';
import { FileText, Wallet, MapPin, Banknote, Clock, Users, ClipboardList, Plus, X, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useTranslation } from 'react-i18next';
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
  submitButtonText,
  loading = false,
  onCancel
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState(initialData);
  const [requirementInput, setRequirementInput] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});

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
      toast.error(t('postJob.validation.reqEmpty'));
      return;
    }

    if (requirement.length < 3) {
      toast.error(t('postJob.validation.reqMin'));
      return;
    }

    if (formData.requirements.includes(requirement)) {
      toast.error(t('postJob.validation.reqExists'));
      return;
    }

    setFormData(prev => ({
      ...prev,
      requirements: [...prev.requirements, requirement]
    }));

    setRequirementInput('');
    toast.success(t('postJob.success.reqAdded'));
  };

  const removeRequirement = (requirement) => {
    setFormData(prev => ({
      ...prev,
      requirements: prev.requirements.filter(r => r !== requirement)
    }));
    toast.success(t('postJob.success.reqRemoved'));
  };

  const validateForm = () => {
    const errors = {};
    let isValid = true;

    // Title validation
    if (!formData.title.trim()) {
      errors.title = t('postJob.validation.titleRequired');
      isValid = false;
    } else if (formData.title.length < 5) {
      errors.title = t('postJob.validation.titleMin');
      isValid = false;
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = t('postJob.validation.descRequired');
      isValid = false;
    }

    // Category validation
    if (!formData.category) {
      errors.category = t('postJob.validation.categoryRequired');
      isValid = false;
    }

    // Custom category validation
    if (formData.category === 'Other') {
      if (!formData.customCategory.trim()) {
        errors.customCategory = t('postJob.validation.customCategoryRequired');
        isValid = false;
      } else if (formData.customCategory.trim().length < 3) {
        errors.customCategory = t('postJob.validation.customCategoryMin');
        isValid = false;
      }
    }

    // Location validation
    if (!formData.location.trim()) {
      errors.location = t('postJob.validation.locationRequired');
      isValid = false;
    }

    // Salary validation
    if (!formData.salary) {
      errors.salary = t('postJob.validation.salaryRequired');
      isValid = false;
    } else if (formData.salary <= 0) {
      errors.salary = t('postJob.validation.salaryMin');
      isValid = false;
    } else if (formData.salary < 100) {
      errors.salary = t('postJob.validation.salaryMinAmount');
      isValid = false;
    }

    // Duration validation
    if (!formData.duration.trim()) {
      errors.duration = t('postJob.validation.durationRequired');
      isValid = false;
    }

    // Workers needed validation
    if (!formData.workersNeeded || formData.workersNeeded < 1) {
      errors.workersNeeded = t('postJob.validation.workersRequired');
      isValid = false;
    }

    setFieldErrors(errors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error(t('postJob.validation.fixErrors'));
      return;
    }

    const jobData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category === 'Other' ? formData.customCategory.trim() : formData.category,
      location: formData.location.trim(),
      salary: Number(formData.salary),
      salaryPeriod: formData.salaryPeriod,
      duration: formData.duration.trim(),
      workersNeeded: Number(formData.workersNeeded),
      requirements: formData.requirements
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
            <h2 className="text-xl font-bold text-gray-900">{t('postJob.basics.title')}</h2>
            <p className="text-sm text-gray-600">{t('postJob.basics.subtitle')}</p>
          </div>
          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
            1
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('postJob.basics.jobTitleLabel')}</label>
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('postJob.basics.categoryLabel')}</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all ${fieldErrors.category
                ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                } focus:outline-none focus:ring-3`}
            >
              <option value="">{t('postJob.basics.selectCategory')}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{t(`postJob.basics.categories.${cat}`)}</option>
              ))}
            </select>
            {fieldErrors.category && (
              <span className="flex items-start text-red-600 text-sm font-medium mt-2">
                <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                {fieldErrors.category}
              </span>
            )}

            {formData.category === 'Other' && (
              <div className="mt-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t('postJob.basics.customCategory')}</label>
                <input
                  type="text"
                  name="customCategory"
                  value={formData.customCategory}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all ${fieldErrors.customCategory
                    ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                    } focus:outline-none focus:ring-3`}
                  placeholder={t('postJob.basics.customCategoryPlaceholder')}
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
            <label className="block text-sm font-semibold text-gray-700 mb-2">{t('postJob.basics.description')}</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={6}
              className={`w-full px-4 py-3 border-2 rounded-lg text-base resize-none transition-all ${fieldErrors.description
                ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                } focus:outline-none focus:ring-3`}
              placeholder={t('postJob.basics.descriptionPlaceholder')}
              maxLength={1000}
            />
            <div className="flex justify-end">
              <p className="text-sm text-gray-600 mt-1">{t('postJob.basics.charCount', { count: formData.description.length })}</p>
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
            <h2 className="text-xl font-bold text-gray-900">{t('postJob.locationPay.title')}</h2>
            <p className="text-sm text-gray-600">{t('postJob.locationPay.subtitle')}</p>
          </div>
          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
            2
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" /> {t('postJob.locationPay.location')}
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
              placeholder={t('postJob.locationPay.locationPlaceholder')}
              maxLength={100}
            />
            {fieldErrors.location && (
              <span className="flex items-start text-red-600 text-sm font-medium mt-2">
                <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                {fieldErrors.location}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Banknote className="w-4 h-4 inline mr-1" /> {t('postJob.locationPay.paymentRate')}
            </label>
            <div className={`flex items-center border-2 rounded-lg overflow-hidden transition-all ${fieldErrors.salary
              ? 'border-red-500 focus-within:border-red-600 focus-within:ring-3 focus-within:ring-red-100'
              : 'border-gray-300 focus-within:border-blue-500 focus-within:ring-3 focus-within:ring-blue-100'
              }`}>
              <span className="px-4 py-3 bg-gray-50 border-r-2 border-gray-300 font-semibold text-gray-700">{t('common.currency')}</span>
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
                <option value="hourly">{t('postJob.locationPay.periods.hour')}</option>
                <option value="daily">{t('postJob.locationPay.periods.day')}</option>
                <option value="weekly">{t('postJob.locationPay.periods.week')}</option>
                <option value="monthly">{t('postJob.locationPay.periods.month')}</option>
                <option value="fixed">{t('postJob.locationPay.periods.fixed')}</option>
              </select>
            </div>
            {fieldErrors.salary && (
              <span className="flex items-start text-red-600 text-sm font-medium mt-2">
                <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                {fieldErrors.salary}
              </span>
            )}
            <span className="text-xs text-gray-600 mt-1 block">{t('postJob.locationPay.paymentHint')}</span>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              <Clock className="w-4 h-4 inline mr-1" /> {t('postJob.locationPay.duration')}
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className={`w-full px-4 py-3 border-2 rounded-lg text-base transition-all ${fieldErrors.duration
                ? 'border-red-500 focus:border-red-600 focus:ring-red-100'
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-100'
                } focus:outline-none focus:ring-3`}
              placeholder="e.g., 2 months, 3 weeks, 10 days"
              maxLength={50}
            />
            {fieldErrors.duration && (
              <span className="flex items-start text-red-600 text-sm font-medium mt-2">
                <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
                {fieldErrors.duration}
              </span>
            )}
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
            <h2 className="text-xl font-bold text-gray-900">{t('postJob.workforce.title')}</h2>
            <p className="text-sm text-gray-600">{t('postJob.workforce.subtitle')}</p>
          </div>
          <div className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
            3
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Users className="w-4 h-4 inline mr-1" /> {t('postJob.workforce.workersNeeded')}
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
            placeholder={t('postJob.workforce.workersPlaceholder')}
          />
          {fieldErrors.workersNeeded && (
            <span className="flex items-start text-red-600 text-sm font-medium mt-2">
              <AlertCircle className="w-4 h-4 mr-1.5 mt-0.5 flex-shrink-0" />
              {fieldErrors.workersNeeded}
            </span>
          )}
          <span className="text-xs text-gray-600 mt-1 block">
            {t('postJob.workforce.workersHint')}
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
              {t('postJob.requirements.title')}
              <span className="ml-2 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full">
                {t('postJob.requirements.optional')}
              </span>
            </h2>
            <p className="text-sm text-gray-600">{t('postJob.requirements.subtitle')}</p>
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
                    title={t('postJob.requirements.remove')}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 text-sm italic">
              {t('postJob.requirements.noRequirements')}
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
              placeholder={t('postJob.requirements.placeholder')}
              maxLength={100}
            />
            <button
              type="button"
              onClick={addRequirement}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4.5 h-4.5" />
              {t('postJob.requirements.addButton')}
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
                {submitButtonText === t('postJob.postButton') ? t('postJob.posting') : t('postJob.updating')}
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
            {t('postJob.cancel')}
          </button>
        </div>

        <div className="mt-4 md:mt-6 p-3 md:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs md:text-sm text-blue-900 leading-relaxed">
            <strong className="font-bold">{t('postJob.tip.label')}</strong> {t('postJob.tip.text')}
          </p>
        </div>
      </div>

    </form>
  );
};

export default JobForm;