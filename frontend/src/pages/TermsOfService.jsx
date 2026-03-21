import React from 'react';
import { Shield, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function TermsOfService({ isModal = false }) {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const from = searchParams.get('from');

    const handleBack = () => {
        if (window.history.state && window.history.state.idx > 0) {
            navigate(-1);
        } else if (from === 'worker') {
            navigate('/signup-worker');
        } else if (from === 'employer') {
            navigate('/signup-employer');
        } else {
            navigate('/signup');
        }
    };

    return (
        <div className={!isModal ? "min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8" : ""}>
            <div className={!isModal ? "max-w-4xl mx-auto bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100" : ""}>
                {!isModal && (
                    <button
                        onClick={handleBack}
                        className="flex items-center text-gray-500 hover:text-blue-600 mb-8 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back
                    </button>
                )}

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Shield size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Workid: User Agreement
                        </h1>
                        <p className="text-gray-500 mt-1 font-medium">Last Updated: March 2026</p>
                    </div>
                </div>

                <div className="prose prose-blue max-w-none text-gray-700 space-y-10">
                    <p className="lead text-lg mb-6 text-gray-900 font-medium">
                        Workid is a digital marketplace that connects talented Workers with proactive Employers. By using our platform, you agree to the following rules designed to keep our community safe, fair, and professional.
                    </p>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0">1</span>
                            The Basics (The "Golden Rules")
                        </h2>
                        <ul className="space-y-3 pl-11">
                            <li><strong>The Relationship:</strong> Workid is a bridge, not a boss. We connect you, but the actual work agreement is strictly between the Worker and the Employer.</li>
                            <li><strong>Eligibility:</strong> You must be 18+ years old, provide truthful information, and have a clean record regarding safety and conduct.</li>
                            <li><strong>Security:</strong> Your account is your responsibility. Never share your OTP or login details. If you share your credentials, Workid cannot be held liable for any resulting issues.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0">2</span>
                            For the Workers
                        </h2>
                        <p className="mb-4 pl-11 text-gray-900">As a Worker on Workid, you are an independent professional. You agree to:</p>
                        <ul className="space-y-3 pl-11">
                            <li><strong>Professionalism:</strong> Deliver quality work and follow the job instructions provided.</li>
                            <li><strong>Conduct:</strong> Stay sober, stay safe, and follow the rules of the workplace.</li>
                            <li><strong>Health:</strong> Ensure you are physically and mentally fit for the tasks you accept.</li>
                            <li><strong>Confidentiality:</strong> Keep any business secrets or private information you learn on the job to yourself.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0">3</span>
                            For the Employers
                        </h2>
                        <p className="mb-4 pl-11 text-gray-900">As an Employer, you are responsible for the work environment. You agree to:</p>
                        <ul className="space-y-3 pl-11">
                            <li><strong>Clarity:</strong> Provide honest and accurate job descriptions.</li>
                            <li><strong>Safety:</strong> Maintain a workspace that meets health and safety standards.</li>
                            <li><strong>Fairness:</strong> Pay agreed-upon wages on time. Note: You must never pay less than the legal minimum wage in Sri Lanka.</li>
                            <li><strong>Respect:</strong> Treat all workers with dignity; exploitation or abuse will result in immediate banning.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0">4</span>
                            Payments, Safety & Disputes
                        </h2>
                        <div className="overflow-hidden rounded-xl border border-gray-200 ml-11 mt-4">
                            <table className="min-w-full divide-y divide-gray-200 text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left font-bold text-gray-900 uppercase tracking-wider text-xs">Policy Feature</th>
                                        <th className="px-6 py-3 text-left font-bold text-gray-900 uppercase tracking-wider text-xs">Detail</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                    <tr>
                                        <td className="px-6 py-4 font-semibold text-gray-900">Wages</td>
                                        <td className="px-6 py-4 text-gray-700">Negotiated directly between Worker and Employer.</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-semibold text-gray-900">Laws</td>
                                        <td className="px-6 py-4 text-gray-700">Both parties must follow Sri Lankan Labour Laws.</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-semibold text-gray-900">Liability</td>
                                        <td className="px-6 py-4 text-gray-700">Users are responsible for their own actions/damages. Workid is not responsible for job quality or financial losses.</td>
                                    </tr>
                                    <tr>
                                        <td className="px-6 py-4 font-semibold text-gray-900">Disputes</td>
                                        <td className="px-6 py-4 text-gray-700">Try to settle issues amicably first. If that fails, arbitration under Sri Lankan law applies.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0">5</span>
                            Account Health & Conduct
                        </h2>
                        <p className="mb-4 pl-11 text-gray-900">To keep the platform high-quality, we have a zero-tolerance policy for:</p>
                        <ul className="space-y-3 pl-11 mb-6">
                            <li><strong>Fraud:</strong> Fake jobs, scams, or misleading profiles.</li>
                            <li><strong>Misconduct:</strong> Harassment, property damage, or negligence.</li>
                            <li><strong>Ratings:</strong> After every job, you can rate each other. Keep reviews honest and respectful. We monitor these to ensure a fair ecosystem.</li>
                        </ul>

                        <div className="bg-red-50 border border-red-200 rounded-xl p-5 ml-11 text-red-900 flex gap-4 mt-8">
                            <span className="text-2xl pt-0.5"></span>
                            <div>
                                <strong>Termination:</strong> Workid reserves the right to suspend or delete your account immediately if these terms are violated or if safety risks are identified.
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 w-8 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0">6</span>
                            Legal Governing
                        </h2>
                        <p className="pl-11 leading-relaxed">
                            These terms are governed by the laws of the Democratic Socialist Republic of Sri Lanka. We may update these terms as the platform grows; continuing to use Workid means you accept the updated version.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                            <span className="bg-blue-100 text-blue-700 px-3 h-8 rounded-lg flex items-center justify-center text-sm flex-shrink-0 font-bold">8.5</span>
                            Data Sharing for Service Fulfillment
                        </h2>
                        <p className="pl-[52px] leading-relaxed">
                            By accepting these Terms, the User (Worker or Employer) expressly authorizes Workid to share necessary personal information—including but not limited to Name, Phone Number, and Profile Ratings—with the counterparty of a potential or confirmed job booking. This sharing is strictly for the purpose of communication, coordination, and fulfillment of the service agreement. Users agree not to use this shared data for any purpose outside of the specific job for which it was provided.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
}
