import React from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const LoginForm = ({ onLogin }) => (
    <div className="space-y-6 w-full max-w-md bg-white p-8 rounded-2xl border shadow-sm">
        <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold text-gray-900">Welcome to WorkID</h2>
            <p className="text-gray-500">Sign in to your account with your phone</p>
        </div>
        <div className="space-y-4">
            <div className="flex gap-2">
                <div className="w-20">
                    <Input label="Code" value="+94" readOnly />
                </div>
                <div className="flex-1">
                    <Input label="Phone Number" placeholder="77 123 4567" type="tel" />
                </div>
            </div>
            <Button className="w-full py-3" onClick={onLogin}>Send OTP Code</Button>
        </div>
    </div>
);

export default LoginForm;