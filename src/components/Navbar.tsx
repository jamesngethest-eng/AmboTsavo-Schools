import React from 'react';
import { School, User, BookOpen, MessageSquare, ShieldCheck, Menu, X, KeyRound, ExternalLink } from 'lucide-react';
import { Student, Teacher } from '../types';

interface NavbarProps {
  currentTab: 'home' | 'campuses' | 'community' | 'parent-portal' | 'teacher-portal' | 'admin';
  onSelectTab: (tab: 'home' | 'campuses' | 'community' | 'parent-portal' | 'teacher-portal' | 'admin') => void;
  loggedInStudent: Student | null;
  activeTeacher: Teacher | null;
  onLogoutParent: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  loggedInStudent,
  activeTeacher,
  onLogoutParent,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-18">
          
          {/* Zone 1: Brand wordmark */}
          <button
            onClick={() => {
              onSelectTab('home');
              setMobileMenuOpen(false);
            }}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-emerald-600 rounded-md shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-800 flex items-center justify-center text-amber-300 shadow-xs group-hover:bg-emerald-900 transition-colors shrink-0">
              <School className="w-5 h-5" />
            </div>
            <div className="whitespace-nowrap shrink-0">
              <span className="text-xl font-bold tracking-tight text-slate-900 block leading-tight font-serif">
                AmboTsavo Schools
              </span>
              <span className="text-xs text-slate-500 font-medium tracking-wide">
                Kajiado &middot; Kimana
              </span>
            </div>
          </button>

          {/* Zone 2: Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-sm font-semibold text-slate-600">
            <button
              onClick={() => onSelectTab('home')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                currentTab === 'home' ? 'text-emerald-800 border-emerald-800' : 'border-transparent'
              }`}
            >
              School
            </button>
            <button
              onClick={() => onSelectTab('campuses')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 cursor-pointer ${
                currentTab === 'campuses' ? 'text-emerald-800 border-emerald-800' : 'border-transparent'
              }`}
            >
              Campuses
            </button>
            <button
              onClick={() => onSelectTab('community')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'community' ? 'text-emerald-800 border-emerald-800' : 'border-transparent'
              }`}
            >
              Community
            </button>
            <button
              onClick={() => onSelectTab('parent-portal')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'parent-portal' ? 'text-emerald-800 border-emerald-800' : 'border-transparent'
              }`}
            >
              Parent Portal
              {loggedInStudent && (
                <span className="w-2 h-2 rounded-full bg-emerald-600" title="Logged in" />
              )}
            </button>
            <button
              onClick={() => onSelectTab('teacher-portal')}
              className={`hover:text-emerald-800 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'teacher-portal' ? 'text-emerald-800 border-emerald-800' : 'border-transparent'
              }`}
            >
              Teacher Hub
              {activeTeacher && (
                <span className="w-2 h-2 rounded-full bg-amber-500" title={`Logged in (${activeTeacher.gradeAssigned})`} />
              )}
            </button>
            <a
              href="/admin.html"
              onClick={(e) => {
                // If running inside single page app, allow tab switch or normal navigation
                onSelectTab('admin');
              }}
              className={`hover:text-amber-700 transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 flex items-center gap-1.5 font-bold cursor-pointer ${
                currentTab === 'admin' ? 'text-amber-800 border-amber-600' : 'text-slate-700 border-transparent'
              }`}
            >
              <KeyRound className="w-3.5 h-3.5 text-amber-600" />
              <span>Admin Portal (admin.html)</span>
            </a>
          </nav>

          {/* Zone 3: Actions */}
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            {loggedInStudent ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectTab('parent-portal')}
                  className="px-3.5 py-2 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors whitespace-nowrap shrink-0 flex items-center gap-2 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{loggedInStudent.name}</span>
                </button>
                <button
                  onClick={onLogoutParent}
                  className="px-2.5 py-2 text-xs font-medium text-slate-500 hover:text-red-700 transition-colors whitespace-nowrap cursor-pointer"
                  title="Log out of parent portal"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onSelectTab('parent-portal')}
                  className="px-4 py-2 text-xs font-bold text-white bg-emerald-800 rounded-xl hover:bg-emerald-900 transition-all shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
                >
                  <User className="w-3.5 h-3.5 text-amber-300" />
                  <span>Parent Portal</span>
                </button>
                <a
                  href="/admin.html"
                  onClick={() => onSelectTab('admin')}
                  className="px-3.5 py-2 text-xs font-bold text-slate-800 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-xs whitespace-nowrap shrink-0 flex items-center gap-1.5 cursor-pointer"
                  title="Click to log in as administrator"
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </a>
              </div>
            )}
          </div>

          {/* Mobile hamburger toggle */}
          <div className="flex lg:hidden items-center gap-2">
            <a
              href="/admin.html"
              onClick={() => onSelectTab('admin')}
              className="px-2.5 py-1.5 text-xs font-bold bg-amber-400 text-slate-950 rounded-lg"
            >
              Admin
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => {
              onSelectTab('home');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer ${
              currentTab === 'home' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
            }`}
          >
            School Overview
          </button>
          <button
            onClick={() => {
              onSelectTab('campuses');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer ${
              currentTab === 'campuses' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
            }`}
          >
            Campuses (Kajiado &amp; Kimana)
          </button>
          <button
            onClick={() => {
              onSelectTab('community');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer ${
              currentTab === 'community' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
            }`}
          >
            Community &amp; Announcements
          </button>
          <button
            onClick={() => {
              onSelectTab('parent-portal');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-between cursor-pointer ${
              currentTab === 'parent-portal' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
            }`}
          >
            <span>Parent Portal</span>
            {loggedInStudent && (
              <span className="text-xs text-emerald-700 font-medium">Logged in: {loggedInStudent.name}</span>
            )}
          </button>
          <button
            onClick={() => {
              onSelectTab('teacher-portal');
              setMobileMenuOpen(false);
            }}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold cursor-pointer ${
              currentTab === 'teacher-portal' ? 'bg-emerald-50 text-emerald-900' : 'text-slate-700'
            }`}
          >
            Teacher Portal &amp; Hub
          </button>
          <a
            href="/admin.html"
            onClick={() => {
              onSelectTab('admin');
              setMobileMenuOpen(false);
            }}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-bold bg-amber-50 text-amber-900 border border-amber-200 flex items-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            <span>Admin Portal (admin.html)</span>
          </a>

          <div className="pt-2 border-t border-slate-100">
            {loggedInStudent ? (
              <button
                onClick={() => {
                  onLogoutParent();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2.5 text-xs font-semibold text-red-700 bg-red-50 rounded-lg cursor-pointer"
              >
                Sign Out ({loggedInStudent.name})
              </button>
            ) : (
              <button
                onClick={() => {
                  onSelectTab('parent-portal');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 rounded-lg cursor-pointer"
              >
                Parent Portal Login
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
