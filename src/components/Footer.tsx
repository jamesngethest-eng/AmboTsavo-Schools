import React from 'react';
import { School, MapPin, Phone, Mail, Clock } from 'lucide-react';

interface FooterProps {
  onSelectTab: (tab: 'home' | 'campuses' | 'community' | 'parent-portal' | 'teacher-portal' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Col 1: Brand & Identity */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-800 text-amber-300 flex items-center justify-center font-bold">
                <School className="w-5 h-5" />
              </div>
              <div>
                <span className="text-base font-bold text-white block font-serif tracking-tight">
                  AmboTsavo Schools
                </span>
                <span className="text-[11px] text-slate-400">Kajiado &middot; Kimana</span>
              </div>
            </div>

            <p className="text-slate-400 text-xs leading-relaxed">
              Excellence in Early Childhood Care &amp; Competency-Based Education (CBC). Nurturing resilient, joyful, and creative learners in Kajiado County, Kenya.
            </p>

            <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800">
              MOE Reg No: <strong className="text-slate-300 font-mono">MOE/KJD/EY/8821</strong>
            </div>
          </div>

          {/* Col 2: Kajiado Town Campus */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-serif">Kajiado Town Campus</h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Plot 18, Ole Kasasi Road, off Kajiado-Namanga Highway</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="font-mono">+254 721 340 112</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Mon &ndash; Fri: 7:45 AM &ndash; 3:30 PM</span>
              </div>
            </div>
          </div>

          {/* Col 3: Kimana Amboseli Campus */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-serif">Kimana Amboseli Campus</h4>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span>Off Loitokitok Highway, Kimana Trading Centre, Kajiado South</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="font-mono">+254 722 554 321</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Mon &ndash; Fri: 7:30 AM &ndash; 3:15 PM</span>
              </div>
            </div>
          </div>

          {/* Col 4: Quick Portals & Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white font-serif">Navigation &amp; Access</h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button
                  onClick={() => onSelectTab('parent-portal')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Parent Portal &amp; Fee Statement
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('community')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Community Announcements &amp; Reactions
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('campuses')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Campuses &amp; Transport Routes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('teacher-portal')}
                  className="hover:text-amber-300 transition-colors cursor-pointer text-left"
                >
                  Teacher Workspace &amp; Assignment Uploads
                </button>
              </li>
              <li>
                <a
                  href="/admin.html"
                  onClick={() => onSelectTab('admin')}
                  className="text-amber-400 hover:text-amber-300 font-bold transition-colors cursor-pointer text-left flex items-center gap-1.5"
                >
                  <span>Admin Portal (admin.html)</span>
                </a>
              </li>
            </ul>

            <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              <span>admissions@ambotsavoschools.ac.ke</span>
            </div>
          </div>

        </div>

        <div className="pt-12 mt-12 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            &copy; 2026 AmboTsavo Schools Ltd. All rights reserved. Registered under Kenya Basic Education Act.
          </div>
          <div className="flex items-center gap-4">
            <span>Kajiado Campus</span>
            <span aria-hidden="true">&middot;</span>
            <span>Kimana Amboseli Campus</span>
            <span aria-hidden="true">&middot;</span>
            <span>M-Pesa Paybill: 522123</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
