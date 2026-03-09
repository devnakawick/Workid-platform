import React from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const EmployerSignupForm = () => (
    <form className="space-y-4 max-w-lg mx-auto bg-white p-8 rounded-2xl border shadow-sm">
        <h2 className="text-xl font-bold mb-4">Employer Registration</h2>
        <Input label="Company Name (Optional)" placeholder="WorkID Solutions" />
        <Input label="Full Name" placeholder="Jane Smith" />
        <Input label="Business Address" placeholder="123 Colombo St" />
        <Button className="w-full">Register as Employer</Button>
    </form>
);

export default EmployerSignupForm;