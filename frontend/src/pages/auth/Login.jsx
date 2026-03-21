import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import logo from '@/images/logo.jpeg';
import { Phone, Lock } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { toast } from 'sonner';


export default function Login() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const { loginWithPassword } = useAuth();

  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!phone.trim() || phone.length < 10) {
      newErrors.phone = 'Valid 10-digit phone number is required';
    }

    if (!password.trim() || password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);
    setErrors({});

    try {
      const user = await loginWithPassword(phone, password);
      toast.success(t('auth.loginSuccess') || 'Logged in successfully!');
      
      const role = user.user_type?.toLowerCase() || 'worker';
      if (role === 'employer') {
          navigate('/employer/dashboard');
      } else {
          navigate('/worker/dashboard');
      }
    } catch (error) {
      const msg = error.response?.data?.detail || 'Invalid phone or password';
      setErrors({ general: msg });
      toast.error(msg);
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
                const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                setPhone(val);
                if (errors.phone) setErrors({ ...errors, phone: '' });
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
                if (errors.password) setErrors({ ...errors, password: '' });
              }}
              error={errors.password}
              icon={<Lock size={18} />}
            />

            <Button
              type="submit"
              className="w-full py-3 mt-6"
              disabled={isLoading}
            >
              {isLoading ? t('common.signingIn') : t('auth.signIn')}
            </Button>
          </form>

          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-3 text-sm text-gray-500">{t('common.or')}</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

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

          <div className="text-center">
            <button
              onClick={() => toast.info(t('auth.forgotPasswordToast'))}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              {t('auth.forgotPassword')}
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 mt-6">
          {t('auth.termsPolicy')}
        </p>
      </div>
    </div>
  );
}