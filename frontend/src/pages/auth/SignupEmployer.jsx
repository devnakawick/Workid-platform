import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import logo from '@/images/logo.jpeg';
import { Mail, Lock, User, Phone } from 'lucide-react';

export default function SignupEmployer() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (e.target.type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: e.target.checked }));
      if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
      return;
    }

    let finalValue = value;
    if (name === 'phone') {
      finalValue = value.replace(/\D/g, '').slice(0, 10);
    } else if (name === 'email') {
      finalValue = value.replace(/\s/g, '');
    }
    setFormData(prev => ({
      ...prev,
      [name]: finalValue
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.replace(/\D/g, '').length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      console.log('Employer signup attempt with:', {
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone
      });

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to OTP verification instead of dashboard
      navigate('/verify-otp', { state: { email: formData.email, role: 'employer' } });
    } catch (error) {
      setErrors({ general: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8 px-4">
          <div className="inline-flex items-center justify-center w-14 h-14 mb-4">
            <button onClick={() => navigate('/')} className="cursor-pointer">
              <img src={logo} alt="WorkID" className="w-14 h-14 rounded-xl object-cover shadow-md" />
            </button>
          </div>
          <p className="text-gray-500 text-sm md:text-base font-medium">{t('auth.signUpTitle', { role: t('auth.employer') })}</p>
        </div>

        {/* Signup Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            {/* Full Name Input */}
            <Input
              label={t('auth.fullName')}
              type="text"
              placeholder={t('auth.namePlaceholder')}
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
              icon={<User size={18} />}
            />

            {/* Email Input */}
            <Input
              label={t('auth.emailAddress')}
              type="email"
              placeholder={t('auth.emailPlaceholder')}
              name="email"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              icon={<Mail size={18} />}
            />

            {/* Phone Input */}
            <Input
              label={t('auth.phoneNumber')}
              type="tel"
              placeholder={t('auth.phonePlaceholder')}
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              error={errors.phone}
              icon={<Phone size={18} />}
            />

            {/* Password Input */}
            <Input
              label={t('auth.createPassword')}
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              name="password"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              icon={<Lock size={18} />}
            />

            {/* Confirm Password Input */}
            <Input
              label={t('auth.confirmPassword')}
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
              icon={<Lock size={18} />}
            />

            {/* Terms and Privacy Checkbox */}
            <div className="flex items-center gap-3 mt-4">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 flex-shrink-0 text-blue-600 bg-white border-gray-300 rounded focus:ring-blue-500 focus:ring-2 cursor-pointer"
              />
              <label htmlFor="agreeTerms" className="text-sm font-medium text-gray-700 cursor-pointer leading-snug">
                I Agree to the{' '}
                <a href="/terms?from=employer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Terms
                </a>
                {' '}and{' '}
                <a href="/privacy?from=employer" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>.
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="mt-1 text-xs text-red-600 font-medium">{errors.agreeTerms}</p>
            )}

            {/* Sign Up Button */}
            <Button
              className="w-full py-3 mt-6"
              onClick={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? t('common.signingUp') : t('auth.createAccount')}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-3 text-sm text-gray-500">{t('common.or')}</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Login Link */}
          <div className="text-center space-y-4">
            <p className="text-gray-600 text-sm">
              {t('auth.alreadyHaveAccount')}{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                {t('auth.signIn')}
              </button>
            </p>
            <div className="pt-2 border-t border-gray-50">
              <button
                onClick={() => navigate('/signup-worker')}
                className="text-xs text-gray-400 hover:text-gray-600 font-medium transition-colors"
              >
                {t('landing.signupAsDesc').split(' ')[0]} {t('auth.worker')}? <span className="underline decoration-gray-200">Click here</span>
              </button>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-6">
          {t('auth.termsPolicy')}
        </p>
      </div>
    </div>
  );
}
