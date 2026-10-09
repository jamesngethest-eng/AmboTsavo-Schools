import React from 'react';
import { MapPin, Phone, Clock, Bus, Award, Sparkles } from 'lucide-react';

export const CampusesSection: React.FC = () => {
  return (
    <section className="py-18 bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold tracking-wider text-emerald-800 uppercase mb-2">
            Campuses &middot; Kajiado County
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight text-balance">
            Two vibrant learning environments tailored for early learners.
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Whether at our central hub in Kajiado Town or our nature-rich campus in Kimana at the foot of Mount Kilimanjaro, each child experiences safe, nurturing spaces tailored for PP1, PP2, and Kindergarten.
          </p>
        </div>

        {/* Campuses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* Campus 1: Kajiado Town Campus */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col hover:border-slate-300 transition-colors">
            <div className="relative h-64 overflow-hidden">
              <img
                src="/src/assets/images/learning_classroom_art_1791538609308.jpg"
                alt="AmboTsavo Schools Kajiado Campus Classroom"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-slate-900/85 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-md">
                Kajiado Central Campus
              </div>
            </div>
            
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-serif mb-2">
                  Kajiado Town Campus
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Located along Kajiado-Namanga Road, minutes from the administrative center. Features dedicated Montessori play studios, safe fenced outdoor turf, baby sensory stations, and a modern dining hall.
                </p>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Plot 18, Ole Kasasi Road, Kajiado Town, Kenya</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>School Hours: 7:45 AM &ndash; 3:30 PM (Mon &ndash; Fri)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Bus className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Transport Routes: Kajiado Town, Isinya, Ilbissil, Enkorika</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Direct Desk: +254 721 340 112 &middot; WhatsApp: +254 712 345 678</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200/80 flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Offerings: Kindergarten &middot; PP1 &middot; PP2</span>
                <span className="text-emerald-800 font-semibold">CBC Approved Center</span>
              </div>
            </div>
          </div>

          {/* Campus 2: Kimana Amboseli Campus */}
          <div className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden flex flex-col hover:border-slate-300 transition-colors">
            <div className="relative h-64 overflow-hidden">
              <img
                src="/src/assets/images/kimana_campus_view_1791538619471.jpg"
                alt="AmboTsavo Schools Kimana Amboseli Campus"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-4 left-4 bg-emerald-950/85 backdrop-blur-xs text-amber-300 text-xs font-semibold px-3 py-1 rounded-md">
                Kimana Amboseli Campus
              </div>
            </div>
            
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-slate-900 font-serif mb-2">
                  Kimana Amboseli Campus
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-6">
                  Set on spacious green grounds overlooking Mount Kilimanjaro near the Amboseli wildlife eco-corridor. Emphasizes outdoor environmental activities, organic vegetable discovery farming, and expansive athletic grounds.
                </p>

                <div className="space-y-3 text-xs text-slate-700">
                  <div className="flex items-center gap-2.5">
                    <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Off Loitokitok Highway, Kimana Trading Centre, Kajiado South</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>School Hours: 7:30 AM &ndash; 3:15 PM (Mon &ndash; Fri)</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Bus className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Transport Routes: Kimana, Loitokitok, Emali junction, Rom</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Direct Desk: +254 722 554 321 &middot; WhatsApp: +254 722 890 123</span>
                  </div>
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-slate-200/80 flex items-center justify-between text-xs font-medium text-slate-500">
                <span>Offerings: Kindergarten &middot; PP1 &middot; PP2</span>
                <span className="text-emerald-800 font-semibold">Eco-School Certified</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
