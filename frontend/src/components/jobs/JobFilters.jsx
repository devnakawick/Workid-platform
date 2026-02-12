import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Briefcase, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";

const CATEGORIES = [
    "Cleaning", "Construction", "Plumbing", "Electrical",
    "Gardening", "Cooking", "Delivery", "Carpentry", "Painting", "Driving", "HVAC", "Other"
];

export const SALARY_RANGES = [
    { label: "Any", min: 0, max: Infinity },
    { label: "Under 2,000", min: 0, max: 2000 },
    { label: "2,000 - 5,000", min: 2000, max: 5000 },
    { label: "5,000 - 10,000", min: 5000, max: 10000 },
    { label: "10,000+", min: 10000, max: Infinity }
];

export default function JobFilters({ filters, onFilterChange, onReset }) {
    const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'all').length;

    return (
        <Card className="mb-6 shadow-sm border-gray-200">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">Filter Jobs</h3>
                    {activeFiltersCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onReset}
                            className="text-gray-600"
                        >
                            <X className="w-4 h-4 mr-1" />
                            Clear ({activeFiltersCount})
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            Location
                        </label>
                        <Input
                            placeholder="Enter location..."
                            value={filters.location || ''}
                            onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            Category
                        </label>
                        <Select
                            value={filters.category || 'all'}
                            onValueChange={(value) => onFilterChange({ ...filters, category: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            Salary Range
                        </label>
                        <Select
                            value={filters.salaryRange || '0'}
                            onValueChange={(value) => onFilterChange({ ...filters, salaryRange: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {SALARY_RANGES.map((range, idx) => (
                                    <SelectItem key={idx} value={idx.toString()}>
                                        {range.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {activeFiltersCount > 0 && (
                    <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                        {filters.location && (
                            <Badge variant="secondary" className="gap-1">
                                Location: {filters.location}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => onFilterChange({ ...filters, location: '' })}
                                />
                            </Badge>
                        )}
                        {filters.category && filters.category !== 'all' && (
                            <Badge variant="secondary" className="gap-1">
                                {filters.category}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => onFilterChange({ ...filters, category: 'all' })}
                                />
                            </Badge>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}