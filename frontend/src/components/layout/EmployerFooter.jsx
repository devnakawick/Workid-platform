import React, { useState } from 'react';
import { Mail, Phone, MapPin, Facebook, Linkedin, Instagram, ChevronDown, ChevronUp } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const FooterAccordionSection = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-800 md:border-none py-4 md:py-0">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left md:cursor-default md:pointer-events-none text-white font-semibold text-lg focus:outline-none"
      >
        <span>{title}</span>
        <span className="md:hidden">
          {isOpen ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </span>
      </button>
      <div className={`mt-4 ${isOpen ? 'block' : 'hidden md:block'}`}>
        {children}
      </div>
    </div>
  );
};

const EmployerFooter = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto pl-4 md:pl-16 pr-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
          
          {/* Column 1: About */}
          <div className="mb-4 md:mb-0">
            <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              WorkID
            </h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {t('footer.descriptionLong')}
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg" aria-label="Facebook">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg" aria-label="LinkedIn">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg" aria-label="Instagram">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <FooterAccordionSection title={t('footer.quickLinks')} defaultOpen={false}>
            <ul className="space-y-2.5">
              {[
                { label: 'Dashboard', path: '/employer/dashboard' },
                { label: 'Post Job', path: '/employer/post-job' },
                { label: 'Manage Jobs', path: '/employer/jobs' },
                { label: 'Review Applications', path: '/employer/applications' },
                { label: 'Search Workers', path: '/employer/find-workers' },
                { label: 'Employer Wallet', path: '/employer/wallet' }
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-400 hover:text-white hover:pl-2 transition-all flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordionSection>

          <FooterAccordionSection title={t('footer.support')} defaultOpen={false}>
            <ul className="space-y-2.5">
              {[
                { label: 'Help Center', path: '/employer/help' },
                { label: 'Terms of Service', path: '/terms' },
                { label: 'Privacy Policy', path: '/privacy' }
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-400 hover:text-white hover:pl-2 transition-all flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all"></span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </FooterAccordionSection>

          <FooterAccordionSection title={t('footer.contactInfo')} defaultOpen={false}>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 group">
                <MapPin className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">
                  123 Main Street
                </span>
              </li>
              <li className="flex items-center gap-3 group">
                <Phone className="w-5 h-5 text-green-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="tel:+94112345678" className="text-sm text-gray-400 hover:text-white transition-colors">
                  +94 11 234 5678
                </a>
              </li>
              <li className="flex items-center gap-3 group">
                <Mail className="w-5 h-5 text-red-500 flex-shrink-0 group-hover:scale-110 transition-transform" />
                <a href="mailto:support@workid.lk" className="text-sm text-gray-400 hover:text-white transition-colors">
                  support@workid.lk
                </a>
              </li>
            </ul>
          </FooterAccordionSection>

        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto pl-4 md:pl-8 pr-4 py-4">
          <div className="flex items-center md:pl-8">
            <p className="text-sm text-gray-400">
              © {currentYear} WorkID. {t('footer.allRightsReserved')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default EmployerFooter;
