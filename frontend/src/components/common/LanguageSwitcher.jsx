import { Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LanguageSwitcher = () => {
    const { i18n } = useTranslation();

    const handleChangeLanguage = (e) => {
        i18n.changeLanguage(e.target.value);
    };

    return (
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-2 py-1.5 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
            <Globe size={16} className="text-gray-400" />
            <select
                className="bg-transparent text-sm font-medium text-gray-700 outline-none cursor-pointer pr-1"
                value={i18n.language}
                onChange={handleChangeLanguage}
            >
                <option value="en">English</option>
                <option value="si">සිංහල</option>
                <option value="ta">தமிழ்</option>
            </select>
        </div>
    );
};

export default LanguageSwitcher;