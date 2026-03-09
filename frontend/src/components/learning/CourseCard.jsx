import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock, BookOpen } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function CourseCard({ course, enrollment, onEnroll }) {
    const { t } = useTranslation();
    const { title, description, category, duration, instructor, image_url, lesson_count } = course || {};
    const isEnrolled = !!enrollment;
    const progress = enrollment?.progress || 0;
    const isCompleted = progress === 100;

    return (
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-200">
            <div className="aspect-video bg-slate-100 relative group overflow-hidden">
                {image_url ? (
                    <img
                        src={image_url}
                        alt={t(`mock.courses.${title}`, title)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-200">
                        <BookOpen className="w-12 h-12 text-slate-400" />
                    </div>
                )}
                {category && (
                    <Badge variant="secondary" className="absolute top-3 right-3 shadow-sm bg-white/90 backdrop-blur-sm">
                        {t(`learning.categories.${category}`, category.replace('_', ' '))}
                    </Badge>
                )}
            </div>

            <CardContent className="flex-1 p-4 pt-5 space-y-3">
                <h3 className="font-bold text-lg leading-tight text-slate-900 line-clamp-2">
                    {t(`mock.courses.${title}`, title || "Untitled Course")}
                </h3>

                <p className="text-sm text-slate-500 line-clamp-2">
                    {t(`mock.courses.${title}_desc`, description || "No description available for this course.")}
                </p>

                <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                    {duration && (
                        <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{t(`mock.durations.${duration}`, duration)}</span>
                        </div>
                    )}
                    {lesson_count && (
                        <div className="flex items-center gap-1">
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>{t('learning.lessons', { count: lesson_count })}</span>
                        </div>
                    )}
                </div>
            </CardContent>

            <CardFooter className="p-4 pt-0 border-t bg-slate-50/50 mt-auto flex flex-col gap-3">
                {isEnrolled ? (
                    <div className="w-full space-y-2 pt-3">
                        <div className="flex justify-between text-xs font-medium text-slate-700">
                            <span>{isCompleted ? t('learning.completed') : t('learning.inProgress')}</span>
                            <span>{progress}%</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>
                ) : (
                    <div className="w-full pt-3">
                        <Button
                            className="w-full"
                            onClick={() => onEnroll(course)}
                        >
                            {t('learning.enrollNow')}
                        </Button>
                    </div>
                )}
            </CardFooter>
        </Card>
    );
}