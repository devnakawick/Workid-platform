import React from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const WorkerSignupForm = () => (
    <form className="space-y-4 max-w-lg mx-auto bg-white p-8 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">Worker Registration</h2>
        <Input label="Full Name" placeholder="John Doe" />
        <Input label="NIC Number" placeholder="19XXXXXXXXXX" />
        <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700">Primary Skill</label>
            <select className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-indigo-500">
                <option>Carpentry</option>
                <option>Plumbing</option>
                <option>Electrical</option>
            </select>
        </div>
        <Button className="w-full">Register as Worker</Button>
    </form>
);

export default WorkerSignupForm;