import React from 'react';
import { BookOpen, Palette, Compass, Activity, Smile, ArrowRight } from 'lucide-react';

interface CurriculumSectionProps {
  onGoToParentPortal: () => void;
}

export const CurriculumSection: React.FC<CurriculumSectionProps> = ({ onGoToParentPortal }) => {
  return (
    <section className="py-18 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="max-w-3xl mb-12">
          <div className="text-xs font-semibold tracking-wider text-emerald-800 uppercase mb-2">
            Early Years Foundation Stage &middot; CBC Framework
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 font-serif tracking-tight text-balance">
            Academic pathways designed for joyful discovery.
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Our curriculum integrates the Kenya Institute of Curriculum Development (KICD) Competency Based Curriculum with play-based Montessori principles. Parents can monitor every milestone through our real-time portal.
          </p>
        </div>

        {/* 3 Key Levels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          
          {/* Kindergarten */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-300 transition-colors shadow-2xs">
            <div>
              <div className="text-xs font-semibold text-emerald-800 mb-1">
                Ages 2.5 &ndash; 3.5 Years
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">
                Kindergarten / Playgroup
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Gentle transition from home to school. Focus on sensory exploration, social bonding, toilet autonomy, nursery rhymes, and colorful hands-on manipulation.
              </p>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="font-semibold text-slate-900 mb-1">Key Learning Strands:</div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Sensory Play &amp; Sand/Water Tables</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Vocabulary Building &amp; Songs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Gross &amp; Fine Motor Coordination</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Self-help Skills &amp; Clean Habits</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Term Fee Guide:</span>
              <span className="font-bold text-slate-900 font-mono">KES 26,000 / term</span>
            </div>
          </div>

          {/* PP1 */}
          <div className="bg-white border-2 border-emerald-700/60 rounded-xl p-6 sm:p-7 flex flex-col justify-between relative shadow-xs">
            <div className="absolute -top-3 right-5 bg-emerald-800 text-white text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
              Most Popular
            </div>
            <div>
              <div className="text-xs font-semibold text-emerald-800 mb-1">
                Ages 4 &ndash; 5 Years
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">
                Pre-Primary 1 (PP1)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Active phonics discovery and mathematical inquiry. Children explore letter sounds, basic writing posture, sorting, environmental plants, and creative music.
              </p>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="font-semibold text-slate-900 mb-1">Key Learning Strands:</div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Jolly Phonics &amp; Sound Blending</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Counting, Shapes &amp; Sorting 1&ndash;20</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Environmental Discovery &amp; Family Roles</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Creative Painting &amp; Story Narratives</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Term Fee Guide:</span>
              <span className="font-bold text-slate-900 font-mono">KES 28,500 / term</span>
            </div>
          </div>

          {/* PP2 */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 sm:p-7 flex flex-col justify-between hover:border-emerald-300 transition-colors shadow-2xs">
            <div>
              <div className="text-xs font-semibold text-emerald-800 mb-1">
                Ages 5 &ndash; 6 Years
              </div>
              <h3 className="text-xl font-bold text-slate-900 font-serif mb-3">
                Pre-Primary 2 (PP2)
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                Transition mastery into primary school. Confident reading of 3-letter CVC words, simple sums, Amboseli wildlife ecological exploration, and physical athletics.
              </p>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="font-semibold text-slate-900 mb-1">Key Learning Strands:</div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Fluent Word Blending &amp; Sentence Reading</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Addition, Subtraction &amp; Spatial Patterns</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Amboseli Wildlife &amp; Science Experiments</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  <span>Grade 1 CBC Readiness Portfolio</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-500">Term Fee Guide:</span>
              <span className="font-bold text-slate-900 font-mono">KES 31,000 / term</span>
            </div>
          </div>

        </div>

        {/* CBC Competency Explanation Banner */}
        <div className="bg-emerald-900 text-white rounded-2xl p-8 lg:p-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <h3 className="text-2xl font-bold font-serif mb-2 text-amber-300">
              Transparent CBC Assessment on Parent Portal
            </h3>
            <p className="text-sm text-emerald-100 leading-relaxed">
              Every learner at AmboTsavo Schools is assessed across four standardized CBC competency levels: <span className="font-semibold text-white">Exceeding Expectations (EE)</span>, <span className="font-semibold text-white">Meeting Expectations (ME)</span>, <span className="font-semibold text-white">Approaching Expectations (AE)</span>, and <span className="font-semibold text-white">Below Expectations (BE)</span>. Parents can log in with their WhatsApp number anytime to review remarks and homework.
            </p>
          </div>
          <button
            onClick={onGoToParentPortal}
            className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-950 font-semibold rounded-lg text-sm whitespace-nowrap transition-colors cursor-pointer shrink-0"
          >
            Check Child&apos;s Records
          </button>
        </div>

      </div>
    </section>
  );
};
