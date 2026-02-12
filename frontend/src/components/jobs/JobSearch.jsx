import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

export default function JobSearch({ value, onChange }) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
                placeholder="Search for jobs, skills, or locations..."
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 h-12 text-base shadow-sm border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
            />
        </div>
    );
}