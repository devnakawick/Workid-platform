import { Briefcase, Twitter, Facebook, Instagram, Github } from 'lucide-react';
import './footer.css';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../common/LanguageSwitcher';
import logo from '@/assets/Workid.jpeg';

const Footer = () => {
    const { t } = useTranslation();

    return (
        <footer className="site-footer">
            <div className="site-footer-grid">
                <div className="site-footer-brand">
                    <div className="brand-wrap">
                        <img src={logo} alt="WorkID" className="brand-logo" />
                        <span className="brand-name">WorkID</span>
                    </div>
                    <p className="brand-tagline">
                        {t('footer.tagline', 'Connecting talent with opportunity through a secure and efficient platform. Your identity, your career, your WorkID.')}
                    </p>
                </div>

                <div className="site-footer-col">
                    <h3>{t('footer.platform', 'Platform')}</h3>
                    <ul>
                        <li><Link to="/Jobs">{t('nav.findJobs', 'Find Jobs')}</Link></li>
                        <li><Link to="/Applications">{t('nav.applications', 'My Applications')}</Link></li>
                        <li><Link to="/Documents">{t('nav.documents', 'Documents')}</Link></li>
                        <li><Link to="/Learning">{t('nav.learning', 'Learning')}</Link></li>
                    </ul>
                </div>

                <div className="site-footer-col">
                    <h3>{t('footer.support', 'Support')}</h3>
                    <ul>
                        <li><Link to="/Settings">{t('nav.settings', 'Settings')}</Link></li>
                        <li><Link to="/Badges">{t('nav.badges', 'Badges')}</Link></li>
                        <li><a href="#">{t('footer.helpCenter', 'Help Center')}</a></li>
                        <li><a href="#">{t('footer.privacyPolicy', 'Privacy Policy')}</a></li>
                    </ul>
                </div>

                <div className="site-footer-col">
                    <h3>{t('footer.connect', 'Connect')}</h3>
                    <div className="site-footer-socials">
                        <a href="#"><Twitter size={20} /></a>
                        <a href="#"><Facebook size={20} /></a>
                        <a href="#"><Instagram size={20} /></a>
                        <a href="#"><Github size={20} /></a>
                    </div>
                </div>
            </div>
            <div className="site-footer-bottom">
                <div className="bottom-left">
                    <p>© {new Date().getFullYear()} WorkID Platform. {t('footer.allRightsReserved', 'All rights reserved.')}</p>
                    <LanguageSwitcher />
                </div>
                <div className="bottom-right">
                    <span>Powered by DeepMind</span>
                </div>
            </div>
        </footer>
    );
};

export default Footer;