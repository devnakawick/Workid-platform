import {
  Briefcase,
  Wallet,
  MessageCircle,
  HelpCircle,
  LogOut,
  Plus,
  Users,
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const employerMenuItems = [
  { path: '/employer/jobs/new', icon: Plus,  label: 'Post Job'        },
  { path: '/employer/jobs',  icon: Briefcase, label: 'My Jobs'         },
  { path: '/employer/applications',icon: MessageCircle, label: 'Applications'    },
  { path: '/employer/workers', icon: Users,  label: 'Find Workers'    },
  { path: '/employer/wallet',  icon: Wallet,  label: 'Employer Wallet' },
];

const workerMenuItems = [
  { path: '/worker/wallet', icon: Wallet, label: 'Worker Wallet' },
];

const bottomMenuItems = [
  { path: '/employer/help', icon: HelpCircle, label: 'Help & Support' },
];

const isPathActive = (itemPath, currentPath) => {
  if (itemPath === '/employer/jobs'         && currentPath.startsWith('/employer/jobs/edit'))    return true;
  if (itemPath === '/employer/applications' && currentPath.startsWith('/employer/applications')) return true;
  if (itemPath === '/employer/workers'      && currentPath.startsWith('/employer/workers'))      return true;
  return currentPath === itemPath;
};

const NavLink = ({ path, icon: Icon, label, active, color = 'blue' }) => {
  const activeClass = color === 'emerald'
    ? 'bg-emerald-50 text-emerald-600 font-semibold'
    : 'bg-blue-50 text-blue-600 font-semibold';

  return (
    <Link
      to={path}
      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active ? activeClass : 'text-gray-700 hover:bg-gray-50'
      }`}
    >
      <Icon className="w-5 h-5" />
      <span>{label}</span>
    </Link>
  );
};

const MockSidebar = () => {
  const location = useLocation();

  const mobileNavItems = [
    { path: '/employer/jobs',icon: Briefcase, label: 'Jobs'         },
    { path: '/employer/applications/', icon: MessageCircle, label: 'Applications' },
    { path: '/employer/jobs/new',  icon: Plus,  label: 'Post'         },
    { path: '/employer/workers', icon: Users,  label: 'Workers'      },
    { path: '/employer/wallet',  icon: Wallet,  label: 'Wallet'       },
  ];

  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-white border-r border-gray-200 min-h-screen sticky top-0 hidden lg:flex flex-col">

        {/* Logo */}
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold text-blue-600">WorkID</h1>
          <p className="text-xs text-yellow-600 mt-1">Mock</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 overflow-y-auto">

          {/* Employer */}
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
            Employer
          </p>
          <div className="space-y-1">
            {employerMenuItems.map(({ path, icon, label }) => (
              <NavLink
                key={path}
                path={path}
                icon={icon}
                label={label}
                active={isPathActive(path, location.pathname)}
                color="blue"
              />
            ))}
          </div>

          {/* Worker */}
          <div className="my-5 border-t border-gray-200" />
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">
            Worker
          </p>
          <div className="space-y-1">
            {workerMenuItems.map(({ path, icon, label }) => (
              <NavLink
                key={path}
                path={path}
                icon={icon}
                label={label}
                active={location.pathname === path}
                color="emerald"
              />
            ))}
          </div>

          {/* Other */}
          <div className="my-5 border-t border-gray-200" />
          <div className="space-y-1">
            {bottomMenuItems.map(({ path, icon, label }) => (
              <NavLink
                key={path}
                path={path}
                icon={icon}
                label={label}
                active={location.pathname === path}
                color="blue"
              />
            ))}
          </div>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t">
          <button className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full">
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* User info */}
        <div className="p-4 bg-blue-50 border-t">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">E</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Employer</p>
              <p className="text-xs text-gray-600">Premium</p>
            </div>
          </div>
        </div>
      </aside>

      {/*MOBILE BOTTOM NAVBAR */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileNavItems.map(({ path, icon: Icon, label }) => {
            const active = isPathActive(path, location.pathname);

            if (path === '/employer/jobs/new') {
              return (
                <Link key={path} to={path} className="flex flex-col items-center gap-0.5">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all ${
                    active ? 'bg-blue-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-blue-600">{label}</span>
                </Link>
              );
            }

            return (
              <Link key={path} to={path} className="flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-all">
                <div className={`w-8 h-8 flex items-center justify-center rounded-lg transition-all ${active ? 'bg-blue-100' : ''}`}>
                  <Icon className={`w-5 h-5 transition-colors ${active ? 'text-blue-600' : 'text-gray-400'}`} />
                </div>
                <span className={`text-xs font-semibold transition-colors ${active ? 'text-blue-600' : 'text-gray-400'}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Spacer so content isn't hidden behind mobile nav */}
      <div className="lg:hidden h-20" />
    </>
  );
};

export default MockSidebar;