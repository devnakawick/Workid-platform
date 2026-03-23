import React from 'react';
import { ChevronUp, Globe } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage } from '@/lib/LanguageContext';

const languages = [
    { code: 'en', label: 'English', nativeLabel: 'English' },
    { code: 'si', label: 'Sinhala', nativeLabel: '\u0DC3\u0DD2\u0D82\u0DC4\u0DBD' },
    { code: 'ta', label: 'Tamil', nativeLabel: '\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD' },
];

export default function LanguageSwitcher() {
    const { language, changeLanguage } = useLanguage();

    const currentLangCode = language || 'en';
    const currentLanguage = languages.find(lang => lang.code === currentLangCode) || languages[0];

    return (
        <div className="fixed bottom-40 xl:bottom-20 right-6 z-[9999] pointer-events-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 bg-white border border-gray-200 shadow-lg rounded-full px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <span>{currentLanguage.nativeLabel}</span>
                        <ChevronUp className="w-4 h-4 text-gray-400" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" align="end" className="w-44 mb-2 p-1.5 shadow-xl border-gray-100 bg-white rounded-xl z-[10000]">
                    {languages.map((lang) => (
                        <DropdownMenuItem
                            key={lang.code}
                            onSelect={() => changeLanguage(lang.code)}
                            className={`flex items-center justify-between gap-3 px-3 py-2.5 cursor-pointer rounded-lg transition-colors ${currentLangCode === lang.code ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <span>{lang.nativeLabel}</span>
                            <span className="text-xs text-gray-400">{lang.label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}