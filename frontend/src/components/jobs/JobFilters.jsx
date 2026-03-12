import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MapPin, DollarSign, Briefcase, X } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { useTranslation } from 'react-i18next';

const CATEGORIES = [
    "Cleaning", "Construction", "Plumbing", "Electrical",
    "Gardening", "Cooking", "Delivery", "Carpentry", "Painting", "Driving", "HVAC", "Other"
];

export const SALARY_RANGES = [
    { label: "common.any", min: 0, max: Infinity },
    { label: "common.under_amount", amount: "2,000", min: 0, max: 2000 },
    { label: "range", min: 2000, max: 5000, rangeText: "2,000 - 5,000" },
    { label: "range", min: 5000, max: 10000, rangeText: "5,000 - 10,000" },
    { label: "range", min: 10000, max: Infinity, rangeText: "10,000+" }
];

export default function JobFilters({ filters, onFilterChange, onReset }) {
    const { t } = useTranslation();
    const activeFiltersCount = Object.values(filters).filter(v => v && v !== 'all').length;

    return (
        <Card className="mb-6 shadow-sm border-gray-200">
            <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{t('jobs.filterJobs')}</h3>
                    {activeFiltersCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={onReset}
                            className="text-gray-600"
                        >
                            <X className="w-4 h-4 mr-1" />
                            {t('jobs.clearFilters')} ({activeFiltersCount})
                        </Button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            {t('jobs.location')}
                        </label>
                        <Input
                            placeholder={t('common.locationPlaceholder')}
                            value={filters.location || ''}
                            onChange={(e) => onFilterChange({ ...filters, location: e.target.value })}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            {t('jobs.category')}
                        </label>
                        <Select
                            value={filters.category || 'all'}
                            onValueChange={(value) => onFilterChange({ ...filters, category: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">{t('applications.all')}</SelectItem>
                                {CATEGORIES.map((cat) => (
                                    <SelectItem key={cat} value={cat}>
                                        {t(`mock.jobs.${cat}`, cat)}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <DollarSign className="w-4 h-4" />
                            {t('jobs.salaryRange')}
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
                                        {idx === 0 ? t(range.label) :
                                            idx === 1 ? t(range.label, { amount: range.amount }) :
                                                range.rangeText ? t('common.range', { min: range.min.toLocaleString(), max: range.max === Infinity ? t('common.plus', { amount: range.min.toLocaleString() }) : range.max.toLocaleString() }) : t(range.label)}
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
                                {t('jobs.location')}: {filters.location}
                                <X
                                    className="w-3 h-3 cursor-pointer"
                                    onClick={() => onFilterChange({ ...filters, location: '' })}
                                />
                            </Badge>
                        )}
                        {filters.category && filters.category !== 'all' && (
                            <Badge variant="secondary" className="gap-1">
                                {t(`mock.jobs.${filters.category}`, filters.category)}
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