import React from 'react';
import { ArrowRight, Sparkles, MapPin, ShieldCheck, HeartHandshake, PhoneCall } from 'lucide-react';

interface HeroSectionProps {
  onGoToParentPortal: () => void;
  onGoToCommunity: () => void;
  onGoToCampuses: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onGoToParentPortal,
  onGoToCommunity,
  onGoToCampuses,
}) => {
  return (
    <section className="relative overflow-hidden bg-slate-900 text-white">
      {/* Background Image with Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          src="/src/assets/images/hero_ambotzavo_school_1791538583417.jpg"
          alt="AmboTsavo Schools learners playing with educational materials"
          className="w-full h-full object-cover object-center opacity-35 filter brightness-95"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-slate-900/40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
        <div className="max-w-3xl">
          {/* Natural human editorial kicker */}
          <div className="text-sm font-semibold tracking-wide text-amber-300 uppercase mb-4 flex items-center gap-2">
            <span>Kajiado &middot; Kimana Campuses</span>
            <span aria-hidden="true">&middot;</span>
            <span>Early Years Foundation &middot; CBC Education</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-serif leading-[1.15] text-balance mb-6">
            Nurturing inquisitive minds in the heart of Kajiado and Kimana.
          </h1>

          <p className="text-base sm:text-lg text-slate-200 leading-relaxed mb-8 max-w-2xl">
            AmboTsavo Schools provides holistically grounded early childhood education for <strong className="text-white">Kindergarten, PP1, and PP2</strong> learners. Guided by Kenya&apos;s Competency Based Curriculum (CBC), Montessori play principles, and close parent-educator partnership.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-12">
            <button
              onClick={onGoToParentPortal}
              className="px-6 py-3.5 text-sm font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg shadow-md transition-all whitespace-nowrap cursor-pointer flex items-center gap-2"
            >
              <span>Access Parent Portal</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={onGoToCommunity}
              className="px-6 py-3.5 text-sm font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/25 rounded-lg backdrop-blur-xs transition-all whitespace-nowrap cursor-pointer"
            >
              Explore School Community Board
            </button>
          </div>

          {/* Adjacency Trust Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 border-t border-white/15 text-sm">
            <div>
              <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
                <span>Dual Campuses</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Kajiado Town Campus &amp; Kimana Amboseli Campus with safe school bus routes.
              </p>
            </div>

            <div>
              <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Parent Transparency</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Instant fee statements, M-Pesa tracking, and live two-way WhatsApp message zone.
              </p>
            </div>

            <div>
              <div className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-amber-300 shrink-0" />
                <span>CBC Competency Focus</span>
              </div>
              <p className="text-slate-300 text-xs leading-relaxed">
                Language, Numeracy, Environmental discovery, and Creative psychomotor growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
