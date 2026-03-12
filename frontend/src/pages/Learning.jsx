import React, { useState } from 'react';
import { GraduationCap, TrendingUp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CourseCard from '../components/learning/CourseCard';
import { AnimatePresence, motion } from 'framer-motion';
import { toast } from 'sonner';
import { useTranslation } from 'react-i18next';
import { mockCourses, mockEnrollments, mockUser } from '@/lib/mockData';

const CATEGORIES = [
    { value: 'all', label: 'learning.allCourses' },
    { value: 'technical_skills', label: 'learning.categories.technical_skills' },
    { value: 'soft_skills', label: 'learning.categories.soft_skills' },
    { value: 'safety', label: 'learning.categories.safety' },
    { value: 'language', label: 'learning.categories.language' },
    { value: 'digital_literacy', label: 'learning.categories.digital_literacy' },
    { value: 'financial_literacy', label: 'learning.categories.financial_literacy' }
];

export default function Learning() {
    const { t } = useTranslation();
    const [activeCategory, setActiveCategory] = useState('all');
    const [enrollments, setEnrollments] = useState(mockEnrollments);

    const handleEnroll = (course) => {
        const existingEnrollment = enrollments.find(e => e.course_id === course.id);
        if (existingEnrollment && existingEnrollment.progress < 100) {
            toast.info(t('learning.continueLearning'));
        } else if (!existingEnrollment) {
            const newEnrollment = {
                id: String(enrollments.length + 1),
                course_id: course.id,
                course_title: course.title,
                worker_id: mockUser.id,
                start_date: new Date().toISOString(),
                progress: 0,
                status: 'active'
            };
            setEnrollments([...enrollments, newEnrollment]);
            toast.success(t('learning.enroll_success'));
        }
    };

    const filteredCourses = mockCourses.filter(course =>
        activeCategory === 'all' || course.category === activeCategory
    );

    const enrolledCourses = mockCourses.filter(course =>
        enrollments.some(e => e.course_id === course.id && e.progress < 100)
    );

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">{t('learning.title')}</h1>
                    <p className="text-gray-600">{t('learning.subtitle')}</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-1">{t('learning.enrolled')}</p>
                        <p className="text-3xl font-bold text-indigo-600">{enrollments.length}</p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-1">{t('learning.completed')}</p>
                        <p className="text-3xl font-bold text-green-600">
                            {enrollments.filter(e => e.progress === 100).length}
                        </p>
                    </div>
                    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-200">
                        <p className="text-sm font-medium text-gray-600 mb-1">{t('learning.inProgress')}</p>
                        <p className="text-3xl font-bold text-purple-600">{enrolledCourses.length}</p>
                    </div>
                </div>

                {/* Tabs */}
                <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
                    <TabsList className="bg-white border border-gray-200 p-1">
                        {CATEGORIES.map((cat) => (
                            <TabsTrigger key={cat.value} value={cat.value} className="text-sm">
                                {t(cat.label)}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </Tabs>

                {/* Continue Learning Section */}
                {enrolledCourses.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                            {t('learning.continue')}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {enrolledCourses.map((course) => {
                                const enrollment = enrollments.find(e => e.course_id === course.id);
                                return (
                                    <CourseCard
                                        key={course.id}
                                        course={course}
                                        enrollment={enrollment}
                                        onEnroll={handleEnroll}
                                    />
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* All Courses */}
                <h2 className="text-xl font-bold text-gray-900 mb-4">
                    {activeCategory === 'all' ? t('learning.allCourses') : t(CATEGORIES.find(c => c.value === activeCategory)?.label)}
                </h2>

                {filteredCourses.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-xl">
                        <GraduationCap className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('learning.noCourses')}</h3>
                        <p className="text-gray-600">{t('learning.checkBack')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {filteredCourses.map((course, idx) => {
                                const enrollment = enrollments.find(e => e.course_id === course.id);
                                return (
                                    <motion.div
                                        key={course.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                    >
                                        <CourseCard
                                            course={course}
                                            enrollment={enrollment}
                                            onEnroll={handleEnroll}
                                        />
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
}