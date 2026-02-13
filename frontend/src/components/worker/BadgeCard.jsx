import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Shield, Medal, Trophy, Star, Zap, Crown, Award } from 'lucide-react';
import moment from 'moment';

const rarityColors = {
    common: "bg-slate-100 text-slate-700 border-slate-200",
    rare: "bg-blue-100 text-blue-700 border-blue-200",
    epic: "bg-purple-100 text-purple-700 border-purple-200",
    legendary: "bg-amber-100 text-amber-700 border-amber-200"
};

const badgeIcons = {
    'Safety Champion': Shield,
    'Skilled Worker': Zap,
    'Team Player': Star,
    'Excellence Award': Trophy,
    'Quick Learner': Crown,
    'default': Medal
};

const badgeGradients = {
    'Safety Champion': 'from-emerald-400 to-teal-500',
    'Skilled Worker': 'from-blue-400 to-indigo-500',
    'Team Player': 'from-violet-400 to-purple-500',
    'Excellence Award': 'from-amber-400 to-orange-500',
    'Quick Learner': 'from-rose-400 to-red-500',
    'default': 'from-slate-400 to-slate-500'
};

export default function BadgeCard({ badge, earned_date }) {
    const { name, description, rarity } = badge || {};

    // Get the icon component or default
    const IconComponent = badgeIcons[name] || badgeIcons['default'];
    // Get the gradient or default
    const gradient = badgeGradients[name] || badgeGradients['default'];

    return (
        <Card className="h-full flex flex-col overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border-gray-200">
            <div className={`aspect-square relative flex items-center justify-center p-8 bg-gradient-to-br ${gradient} bg-opacity-10 group`}>
                <div className="absolute inset-0 bg-white opacity-90"></div>

                {/* Decorative background shape */}
                <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-10 blur-xl group-hover:opacity-20 transition-opacity`}></div>

                <div className={`relative w-24 h-24 rounded-full bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform duration-300 ring-4 ring-white`}>
                    <IconComponent className="w-12 h-12 text-white drop-shadow-md" strokeWidth={1.5} />
                </div>

                {rarity && (
                    <Badge
                        className={`absolute top-3 right-3 ${rarityColors[rarity] || rarityColors.common} capitalize border shadow-sm`}
                    >
                        {rarity}
                    </Badge>
                )}
            </div>

            <CardContent className="flex-1 p-5 text-center space-y-2">
                <h3 className="font-bold text-lg leading-tight text-slate-900">
                    {name || "Unknown Badge"}
                </h3>
                <p className="text-sm text-slate-500 line-clamp-2">
                    {description || "No description available."}
                </p>
            </CardContent>

            {earned_date && (
                <CardFooter className="p-4 pt-0 border-t bg-slate-50/50 mt-auto justify-center">
                    <div className="w-full pt-3 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Earned {moment(earned_date).format('MMM D, YYYY')}</span>
                    </div>
                </CardFooter>
            )}
        </Card>
    );
}