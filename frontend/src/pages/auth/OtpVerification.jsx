import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { Smartphone, ArrowLeft, RefreshCw, Clock } from 'lucide-react';
import Button from '@/components/common/Button';
import logo from '@/images/logo.jpeg';
import { useAuth } from '@/lib/AuthContext';

export default function OtpVerification() {
    const navigate = useNavigate();
    const location = useLocation();
    const { updateUser } = useAuth();
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(119); // 2 minutes
    const [isResending, setIsResending] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const inputs = useRef([]);

    // Extract the role from location state to know where to redirect after verification
    const role = location.state?.role || 'worker';
    const emailStr = location.state?.email || location.state?.phone || '+1 234 567 8900';

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => (prev > 0 ? prev - 1 : 0));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e, index) => {
        const val = e.target.value;
        if (isNaN(val)) return false;

        const newOtp = [...otp];
        newOtp[index] = val.slice(-1);
        setOtp(newOtp);

        // Focus next input
        if (val && index < 5) {
            inputs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace') {
            if (!otp[index] && index > 0) {
                inputs.current[index - 1].focus();
            }
        }
    };

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
    };

    const handleVerify = async (e) => {
        e.preventDefault();
        const code = otp.join('');

        if (code.length < 6) {
            toast.error('Please enter the full 6-digit code');
            return;
        }

        setIsLoading(true);
        try {
            // Simulate API verification
            console.log('Verifying OTP:', code);
            await new Promise(resolve => setTimeout(resolve, 1500));

            // Update user role in global state before navigation
            const capitalizedRole = role.charAt(0).toUpperCase() + role.slice(1);
            updateUser({ role: capitalizedRole });

            toast.success('Account verified successfully!');

            // Navigate to the correct dashboard based on role
            if (role === 'employer') {
                navigate('/employer/dashboard');
            } else {
                navigate('/worker/dashboard');
            }
        } catch (error) {
            toast.error('Invalid code. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0) return;

        setIsResending(true);
        try {
            // Simulate resend API
            await new Promise(resolve => setTimeout(resolve, 1000));
            setOtp(['', '', '', '', '', '']);
            setTimer(119);
            toast.success('A new code has been sent to your device');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-8 font-medium"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 mb-4">
                        <img src={logo} alt="WorkID" className="w-16 h-16 rounded-2xl object-cover shadow-lg border-2 border-white" />
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Verify Code</h1>
                    <p className="text-gray-500 leading-relaxed font-medium">
                        We've sent a 6-digit verification code to <span className="text-gray-900 font-bold">{emailStr}</span>
                    </p>
                </div>

                {/* OTP Card */}
                <div className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-gray-100 p-8 md:p-10 space-y-8">
                    <div className="flex justify-center mb-2">
                        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                            <Smartphone size={28} />
                        </div>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-8">
                        <div className="flex justify-between gap-1 sm:gap-2">
                            {otp.map((data, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    maxLength="1"
                                    ref={(el) => (inputs.current[index] = el)}
                                    value={data}
                                    onChange={(e) => handleChange(e, index)}
                                    onKeyDown={(e) => handleKeyDown(e, index)}
                                    className="w-10 h-12 xs:w-12 xs:h-14 md:w-14 md:h-16 text-center text-lg md:text-xl font-bold rounded-xl border-2 border-gray-100 focus:border-blue-500 focus:ring-4 focus:ring-blue-50 transition-all outline-none bg-slate-50/50"
                                />
                            ))}
                        </div>

                        <Button
                            type="submit"
                            className="w-full py-3.5 md:py-4 text-base md:text-lg font-black shadow-lg shadow-blue-200"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Verifying...' : 'Verify Now'}
                        </Button>
                    </form>

                    <div className="text-center pt-2">
                        {timer > 0 ? (
                            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                                <Clock size={14} />
                                Resend code in <span className="font-bold text-gray-900">{formatTime(timer)}</span>
                            </p>
                        ) : (
                            <button
                                onClick={handleResend}
                                disabled={isResending}
                                className="text-blue-600 hover:text-blue-700 font-bold text-sm flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                            >
                                {isResending ? (
                                    <RefreshCw className="animate-spin" size={16} />
                                ) : (
                                    <RefreshCw size={16} />
                                )}
                                Resend Code
                            </button>
                        )}
                    </div>
                </div>

                {/* Security Note */}
                <p className="text-center text-xs text-gray-400 mt-8 font-medium italic">
                    Didn't receive the code? Check your spam folder or try another method
                </p>
            </div>
        </div>
    );
}
