import React from 'react';
import { Lock, ArrowLeft } from 'lucide-react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PrivacyPolicy({ isModal = false }) {
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
                        className="flex items-center text-gray-500 hover:text-green-600 mb-8 transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        Back
                    </button>
                )}

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        <Lock size={24} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            Workid Privacy Policy
                        </h1>
                        <div className="text-gray-500 mt-1 flex flex-wrap gap-x-6 gap-y-1 text-sm font-medium">
                            <span>Last Updated: March 2026</span>
                            <span>Entity: Workid Platform (Sri Lanka)</span>
                        </div>
                    </div>
                </div>

                <div className="prose prose-green max-w-none text-gray-700 space-y-10">

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">1. Introduction</h2>
                        <p className="leading-relaxed">
                            Workid ("we," "us," or "our") is committed to protecting the privacy and personal data of our Users (Workers and Employers). This Privacy Policy serves as a legal notice to inform you of our practices regarding the collection, use, and disclosure of personal information when you use the Workid platform. By creating an account, you consent to the data practices described in this policy.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">2. Comprehensive Data Collection</h2>
                        <p className="mb-6 text-gray-900">We collect information that identifies you or can be used to identify you. This includes:</p>

                        <div className="space-y-6">
                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-green-600 font-black">A.</span> Personal Identification Information
                                </h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Full Name:</strong> To establish your professional identity on the platform.</li>
                                    <li><strong>Phone Number:</strong> Used as your primary account identifier and for secure communication.</li>
                                    <li><strong>Language Preferences:</strong> To provide a localized and user-friendly interface.</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-green-600 font-black">B.</span> Technical & Account Data
                                </h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>OTP Verification:</strong> Records of One-Time Passwords sent for identity validation.</li>
                                    <li><strong>Login Activity:</strong> IP addresses, device types, and timestamps of your sessions to monitor for unauthorized access.</li>
                                    <li><strong>Account Status:</strong> Internal records of your standing (Active, Suspended, or Terminated).</li>
                                </ul>
                            </div>

                            <div className="bg-gray-50 rounded-xl p-5 border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-green-600 font-black">C.</span> Service & Transactional Data
                                </h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li><strong>Job Details:</strong> Information regarding tasks posted by Employers and accepted by Workers.</li>
                                    <li><strong>Work History:</strong> A log of completed assignments, cancellations, and active engagements.</li>
                                    <li><strong>Ratings & Reviews:</strong> Publicly visible feedback provided by users to build a trust-based ecosystem.</li>
                                </ul>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">3. How We Process Your Information</h2>
                        <p className="mb-4 text-gray-900">We process your data based on Contractual Necessity (to make the platform work) and Safety Interests. Specifically:</p>
                        <ul className="list-disc pl-5 space-y-3">
                            <li><strong>Account Management:</strong> To register you as a user and maintain your profile.</li>
                            <li><strong>Authentication:</strong> Using OTP-based verification to ensure that only you can access your account, reducing the risk of identity theft.</li>
                            <li><strong>The Marketplace Engine:</strong> To match Workers with Employers based on availability and job requirements.</li>
                            <li><strong>Safety & Fraud Prevention:</strong> To investigate suspicious activity, verify user eligibility, and protect the community from scams.</li>
                            <li><strong>Platform Analytics:</strong> To understand user behavior and improve our features and performance.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">4. Data Security & Integrity </h2>
                        <p className="mb-4 text-gray-900">We implement administrative, technical, and physical security measures designed to protect your information from unauthorized access or disclosure.</p>
                        <ul className="list-disc pl-5 space-y-3">
                            <li><strong>Encryption:</strong> Sensitive data (like login tokens) is encrypted during transit.</li>
                            <li><strong>Access Control:</strong> Only authorized Workid staff have access to backend user data.</li>
                            <li><strong>User Responsibility:</strong> Security is a shared duty. You are strictly responsible for safeguarding your phone and any OTP codes received. Any breach resulting from the sharing of your OTP is your sole liability.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">5. Mandatory Data Sharing for Platform Operations</h2>
                        <div className="bg-green-50 text-green-800 p-4 rounded-xl border border-green-100 mb-6 font-medium">
                            Workid does NOT sell, rent, or trade your personal data to third parties for marketing purposes.
                        </div>
                        <p className="mb-4 text-gray-900">To facilitate the connection between Workers and Employers, Workid must share specific data points. By using the platform, you acknowledge and agree to the following:</p>
                        <ul className="list-disc pl-5 space-y-3">
                            <li><strong>Mutual Disclosure:</strong> Once a Worker expresses interest in a job or an Employer initiates a request, Workid will disclose the Worker’s name and contact number to the Employer, and the Employer’s location and contact details to the Worker.</li>
                            <li><strong>Purpose of Disclosure:</strong> This data sharing is a core requirement of the Workid service. It allows for real-time coordination, site directions, and emergency contact during the performance of work.</li>
                            <li><strong>Consent via Agreement:</strong> Your agreement to the Terms & Conditions constitutes your "Informed Consent" for this data sharing.</li>
                            <li><strong>Third-Party Restriction:</strong> Neither the Worker nor the Employer is permitted to sell, leak, or use the other party's contact information for harassment, marketing, or any purpose unrelated to the Workid job. Violation of this will lead to immediate account termination.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">6. Data Retention & Deletion</h2>
                        <ul className="list-disc pl-5 space-y-3">
                            <li><strong>Retention:</strong> We store your data for as long as your account is active to provide you with your work history and ratings.</li>
                            <li><strong>Inactivity:</strong> Accounts that remain inactive for an extended period (as determined by platform policy) may be archived or deleted to minimize data risks.</li>
                            <li><strong>Account Closure:</strong> If you request to delete your account, we will remove your personal data from our active database, though some transactional records may be kept for legal or tax audit purposes.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">7. User Rights & Choices</h2>
                        <p className="mb-4 text-gray-900">Under our policy, you have the following rights:</p>
                        <ul className="list-disc pl-5 space-y-3">
                            <li><strong>Right to Rectification:</strong> You can update your profile information at any time if it is inaccurate.</li>
                            <li><strong>Right to Access:</strong> You can request a summary of the data we hold about you.</li>
                            <li><strong>Right to Erasure:</strong> You may request that we delete your account and associated personal data.</li>
                            <li><strong>Opt-Out:</strong> You may choose not to provide certain information, though this may limit your ability to use the platform's features.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">8. Cookies & Tracking</h2>
                        <p className="mb-4 text-gray-900">Our platform may use "cookies" or similar tracking technologies to:</p>
                        <ul className="list-disc pl-5 space-y-2">
                            <li>Keep you logged in across sessions.</li>
                            <li>Analyze platform traffic and usage patterns.</li>
                            <li>Remember your language preferences.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">9. Changes to this Policy</h2>
                        <p className="leading-relaxed">Workid reserves the right to modify this Privacy Policy. Any changes will be posted on this page with an updated "Last Updated" date. Continued use of the platform after changes are posted constitutes your acceptance of the new terms.</p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4">10. Contact Us</h2>
                        <p className="leading-relaxed">If you have questions about this policy or wish to exercise your data rights, please contact the Workid Data Privacy Team via the platform's support channel.</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
