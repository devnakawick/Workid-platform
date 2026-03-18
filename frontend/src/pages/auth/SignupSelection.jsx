import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Briefcase, User, ArrowLeft } from 'lucide-react';
import logo from '@/images/logo.jpeg';

export default function SignupSelection() {
    const { t } = useTranslation();
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 sm:p-12">
            <div className="w-full max-w-2xl text-center space-y-12">
                {/* Logo & Header */}
                <div className="flex flex-col items-center space-y-4">
                    <button
                        onClick={() => navigate('/landing')}
                        className="transition-transform hover:scale-105 active:scale-95"
                    >
                        <img src={logo} alt="WorkID" className="h-20 w-auto rounded-3xl shadow-xl border-4 border-white" />
                    </button>
                    <div className="space-y-2">
                        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter italic">WorkID</h1>
                        <p className="text-slate-500 font-medium text-lg max-w-md mx-auto">{t('landing.getStartedDialogDesc')}</p>
                    </div>
                </div>

                {/* Selection Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                    {/* Worker Card */}
                    <button
                        onClick={() => navigate('/signup-worker')}
                        className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-500 transition-all duration-500 text-left overflow-hidden ring-0 hover:ring-4 ring-blue-50"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-blue-50 rounded-bl-full -mr-20 -mt-20 group-hover:bg-blue-100 transition-colors" />
                        <div className="relative">
                            <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-blue-200 group-hover:scale-110 transition-transform duration-500">
                                <User size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">{t('auth.worker')}</h2>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">{t('landing.signupAsDesc')}</p>
                            <div className="mt-10 flex items-center gap-2 text-blue-600 font-black text-sm">
                                <span className="uppercase tracking-widest">{t('auth.signUp')}</span>
                                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </div>
                        </div>
                    </button>

                    {/* Employer Card */}
                    <button
                        onClick={() => navigate('/signup-employer')}
                        className="group relative bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-indigo-500 transition-all duration-500 text-left overflow-hidden ring-0 hover:ring-4 ring-indigo-50"
                    >
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-50 rounded-bl-full -mr-20 -mt-20 group-hover:bg-indigo-100 transition-colors" />
                        <div className="relative">
                            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center text-white mb-8 shadow-xl shadow-indigo-200 group-hover:scale-110 transition-transform duration-500">
                                <Briefcase size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-3">{t('auth.employer')}</h2>
                            <p className="text-slate-500 text-sm leading-relaxed font-medium">{t('landing.signupAsDesc')}</p>
                            <div className="mt-10 flex items-center gap-2 text-indigo-600 font-black text-sm">
                                <span className="uppercase tracking-widest">{t('auth.signUp')}</span>
                                <span className="group-hover:translate-x-2 transition-transform duration-300">→</span>
                            </div>
                        </div>
                    </button>
                </div>

                {/* Footer Navigation */}
                <div className="pt-8 flex flex-col items-center gap-6">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                        <span>{t('auth.alreadyHaveAccount')}</span>
                        <button
                            onClick={() => navigate('/login')}
                            className="text-blue-600 font-bold hover:underline decoration-2 underline-offset-4"
                        >
                            {t('auth.signIn')}
                        </button>
                    </div>

                    <button
                        onClick={() => navigate('/landing')}
                        className="group inline-flex items-center gap-2 text-slate-400 hover:text-slate-600 font-bold transition-all text-sm uppercase tracking-tighter"
                    >
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                        {t('common.home')}
                    </button>
                </div>
            </div>
        </div>
    );
}
