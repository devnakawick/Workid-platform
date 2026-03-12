import React from 'react';
import Button from '../common/Button';

const OTPVerification = ({ onVerify, onBack }) => (
    <div className="space-y-6 w-full max-w-md bg-white p-8 rounded-2xl border shadow-sm text-center">
        <h2 className="text-2xl font-bold">Verify Phone</h2>
        <p className="text-gray-500">Enter the 6-digit code sent to your phone</p>
        <div className="flex gap-2 justify-center">
            {[...Array(6)].map((_, i) => (
                <input key={i} type="text" maxLength="1" className="w-12 h-14 text-center text-xl font-bold border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" />
            ))}
        </div>
        <Button className="w-full" onClick={onVerify}>Verify Account</Button>
        <button onClick={onBack} className="text-sm text-indigo-600 font-medium">Resend code in 00:59</button>
    </div>
);

export default OTPVerification;