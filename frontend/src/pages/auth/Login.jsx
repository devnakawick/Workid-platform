import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import logo from '@/images/logo.jpeg';
import { Mail, Lock, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);



  const handleSignIn = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    if (!phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (phone.length < 10) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);

    // If there are validation errors, don't proceed
    if (Object.keys(newErrors).length > 0) {
      return;
    }

    setIsLoading(true);
    try {
      // Standalone mode: Mocking authentication
      console.log('Login attempt with:', { phone, password, role });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to OTP verification instead of dashboard
      navigate('/verify-otp', { state: { phone, role } });
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
          <p className="text-gray-500 text-sm md:text-base font-medium">{t('auth.signInTitle')}</p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
          {/* Role Selection */}
          <div className="flex p-1 bg-slate-100 rounded-xl">
            <button
              onClick={() => setRole('worker')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'worker'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {t('auth.worker')}
            </button>
            <button
              onClick={() => setRole('employer')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'employer'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              {t('auth.employer')}
            </button>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Phone Input */}
            <Input
              label={t('auth.phoneNumber')}
              type="tel"
              placeholder={t('auth.phonePlaceholder')}
              value={phone}
              onChange={(e) => {
                let val = e.target.value;
                val = val.replace(/\D/g, '').slice(0, 10);
                setPhone(val);
                if (errors.phone) {
                  setErrors({ ...errors, phone: '' });
                }
              }}
              maxLength={10}
              error={errors.phone}
              icon={<Phone size={18} />}
            />

            {/* Password Input */}
            <Input
              label={t('auth.password')}
              type="password"
              placeholder={t('auth.passwordPlaceholder')}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) {
                  setErrors({ ...errors, password: '' });
                }
              }}
              error={errors.password}
              icon={<Lock size={18} />}
            />

            {/* Sign In Button */}
            <Button
              className="w-full py-3 mt-6"
              onClick={handleSignIn}
              disabled={isLoading}
            >
              {isLoading ? t('common.signingIn') : t('auth.signIn')}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-3 text-sm text-gray-500">{t('common.or')}</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              {t('auth.noAccount')}{' '}
              <button
                onClick={() => navigate('/signup')}
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                {t('auth.signUp')}
              </button>
            </p>
          </div>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              onClick={() => toast.info(t('auth.forgotPasswordToast'))}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {t('auth.forgotPassword')}
            </button>
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
