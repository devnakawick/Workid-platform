import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import logo from '@/images/logo.jpeg';
import { Mail, Lock, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('worker');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // Simple email validation
  const validateEmail = (emailValue) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validation
    // Validation
    if (role === 'employer') {
      if (!email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!validateEmail(email)) {
        newErrors.email = 'Please enter a valid email address';
      }
    } else if (role === 'worker') {
      if (!email.trim()) {
        newErrors.email = 'Phone number is required';
      }
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
      console.log('Login attempt with:', { email, password, role });

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Navigate to OTP verification instead of dashboard
      navigate('/verify-otp', { state: { email, role } });
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
            <img src={logo} alt="WorkID" className="w-14 h-14 rounded-xl object-cover shadow-md" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">WorkID</h1>
          <p className="text-gray-500 text-sm md:text-base font-medium">Sign in to your account</p>
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
              Worker
            </button>
            <button
              onClick={() => setRole('employer')}
              className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${role === 'employer'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
            >
              Employer
            </button>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSignIn} className="space-y-4">
            {/* Email/Phone Input */}
            <Input
              label={role === 'worker' ? "Phone Number" : "Email Address"}
              type={role === 'worker' ? "tel" : "email"}
              placeholder={role === 'worker' ? "07X XXX XXXX" : "you@example.com"}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: '' });
                }
              }}
              error={errors.email}
              icon={role === 'worker' ? <Phone size={18} /> : <Mail size={18} />}
            />

            {/* Password Input */}
            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
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
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="px-3 text-sm text-gray-500">or</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/landing')}
                className="text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* Forgot Password Link */}
          <div className="text-center">
            <button
              onClick={() => toast.info('Password reset feature coming soon!')}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              Forgot your password?
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500 mt-6">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
}
