import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Globe } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const languages = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'si', label: 'Sinhala', short: 'SI' },
    { code: 'ta', label: 'Tamil', short: 'TA' },
];

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    // Get base code (e.g. 'en' from 'en-US')
    const currentLangCode = i18n.language?.split('-')[0] || 'en';
    const currentLanguage = languages.find(lang => lang.code === currentLangCode) || languages[0];

    useEffect(() => {
        document.documentElement.lang = currentLangCode;
    }, [currentLangCode]);

    const changeLanguage = (code) => {
        i18n.changeLanguage(code);
    };

    return (
        <div className="fixed bottom-40 xl:bottom-20 right-6 z-[9999] pointer-events-auto">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 bg-white border border-gray-200 shadow-lg rounded-full px-4 py-2 text-sm font-semibold text-gray-800 hover:bg-gray-50 transition-all hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer">
                        <Globe className="w-5 h-5 text-blue-600" />
                        <span>{currentLanguage.short}</span>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="bottom" align="end" className="w-40 mb-2 p-1.5 shadow-xl border-gray-100 bg-white rounded-xl z-[10000]">
                    {languages.map((lang) => (
                        <DropdownMenuItem
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`flex items-center gap-3 px-3 py-2 cursor-pointer rounded-lg transition-colors ${currentLangCode === lang.code ? 'bg-blue-50 text-blue-700 font-bold' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                                }`}
                        >
                            <span>{lang.label}</span>
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
}