import { Heart, Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300 mt-auto">

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto pl-16 pr-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

          {/* Column 1: About */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              WorkID
            </h3>
            <p className="text-sm text-gray-400 mb-4 leading-relaxed">
              {t('footer.descriptionLong')}
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-blue-700 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-lg flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'aboutUs', path: '/about-us' },
                { label: 'browseJobs', path: '/browse-jobs' },
                { label: 'findWorkers', path: '/find-workers' },
                { label: 'howItWorks', path: '/how-it-works' },
                { label: 'pricing', path: '/pricing' }
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-400 hover:text-white hover:pl-2 transition-all flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all"></span>
                    {t(`footer.${item.label}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">{t('footer.support')}</h4>
            <ul className="space-y-2.5">
              {[
                { label: 'helpCenter', path: '/help-center' },
                { label: 'faq', path: '/faq' },
                { label: 'termsOfService', path: '/terms-of-service' },
                { label: 'privacyPolicy', path: '/privacy-policy' },
                { label: 'contactUs', path: '/contact-us' }
              ].map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-sm text-gray-400 hover:text-white hover:pl-2 transition-all flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-blue-500 mr-0 group-hover:mr-2 transition-all"></span>
                    {t(`footer.${item.label}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4 text-lg">{t('footer.contactInfo')}</h4>
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
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto pl-8 pr-4 py-4">
          <div className="flex items-center pl-8">
            <p className="text-sm text-gray-400">
              © {currentYear} WorkID. {t('footer.allRightsReserved')}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;