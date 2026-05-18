import React, { useState } from 'react';
import { Sparkles, Dumbbell, ShieldCheck, Activity, Heart, ArrowRight } from 'lucide-react';
import { PRODUCTS } from '../data/products';

const FITNESS_GOALS = [
  {
    id: 'muscle',
    label: 'Muscle Building',
    icon: Dumbbell,
    desc: 'High protein millet noodles and sprouted grains to accelerate lean muscle repair.',
    color: 'text-primary dark:text-success-light',
    bg: 'bg-primary/10 dark:bg-success/20',
    matchingIds: ['nd-noodles', 'pw-sprout', 'rm-dosa']
  },
  {
    id: 'weight',
    label: 'Weight Loss & Fiber',
    icon: Activity,
    desc: 'High fiber grains and natural metabolic boosters with low calorie structures.',
    color: 'text-highlight',
    bg: 'bg-highlight/10',
    matchingIds: ['pw-beetroot', 'sp-soup', 'rm-upma', 'im-instant-upma']
  },
  {
    id: 'sugar',
    label: 'Diabetic Control',
    icon: ShieldCheck,
    desc: 'Clinically proven low-GI millet additives to effectively regulate blood sugar levels.',
    color: 'text-success',
    bg: 'bg-success/10',
    matchingIds: ['pw-jackfruit', 'rm-kichdi', 'im-rawa-dosa']
  },
  {
    id: 'immunity',
    label: 'Immunity & Detox',
    icon: Heart,
    desc: 'Antioxidant and Vitamin C dense superfood powders to build robust defense systems.',
    color: 'text-secondary dark:text-accent-light',
    bg: 'bg-secondary/10 dark:bg-accent/20',
    matchingIds: ['pw-amla', 'pw-moringa', 'pw-rasam']
  }
];

export default function AiRecommendations({ onQuickView, onAddToCart }) {
  const [activeGoalId, setActiveGoalId] = useState('muscle');

  const activeGoal = FITNESS_GOALS.find(g => g.id === activeGoalId);
  const recommendedProducts = PRODUCTS.filter(p => activeGoal.matchingIds.includes(p.id));

  return (
    <section className="py-20 bg-cream/20 dark:bg-cream-dark/5 border-t border-b border-accent/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12" data-aos="fade-up">
          <span className="text-xs uppercase tracking-widest font-extrabold text-primary dark:text-success-light bg-primary/10 px-3.5 py-1.5 rounded-full inline-flex items-center gap-1.5">
            <Sparkles size={12} className="animate-spin text-primary dark:text-success-light" />
            <span>Smart Recommendations</span>
          </span>
          <h2 className="text-3xl sm:text-4xl font-outfit font-black text-textDark dark:text-cream mt-3">
            AI-Powered Nutrition Advisor
          </h2>
          <p className="text-sm text-textLight dark:text-cream/50 mt-2 font-semibold">
            Choose your fitness or health target and let our organic advisor build the perfect plate.
          </p>
        </div>

        {/* Tab Selection Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-4xl mx-auto mb-10" data-aos="fade-up">
          {FITNESS_GOALS.map((goal) => {
            const Icon = goal.icon;
            const isSelected = activeGoalId === goal.id;

            return (
              <button
                key={goal.id}
                onClick={() => setActiveGoalId(goal.id)}
                className={`flex flex-col items-center text-center p-4 rounded-3xl border transition-all scale-100 active:scale-95 ${
                  isSelected
                    ? 'bg-white dark:bg-darkCard border-primary dark:border-success-light shadow-premium'
                    : 'bg-transparent border-accent/20 hover:bg-white/50 dark:hover:bg-darkCard/30'
                }`}
              >
                <div className={`p-3 rounded-full mb-3 ${goal.bg} ${goal.color}`}>
                  <Icon size={20} />
                </div>
                <h3 className="text-xs sm:text-sm font-extrabold text-textDark dark:text-cream">
                  {goal.label}
                </h3>
              </button>
            );
          })}
        </div>

        {/* Goal Description and Recommended Products */}
        <div className="max-w-5xl mx-auto bg-white dark:bg-darkCard border border-accent/10 dark:border-accent/5 rounded-3xl p-6 sm:p-8 shadow-premium" data-aos="fade-up">
          
          <div className="border-b border-accent/5 pb-4 mb-6">
            <p className="text-xs text-textLight dark:text-cream/50 uppercase tracking-widest font-black">Active AI Prescription</p>
            <p className="text-sm sm:text-base font-semibold text-textDark dark:text-cream/80 mt-1 leading-relaxed">
              "{activeGoal.desc}"
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {recommendedProducts.map((p) => (
              <div
                key={p.id}
                className="group relative flex flex-col justify-between p-4 rounded-2xl border border-accent/15 dark:border-accent/5 hover:border-primary transition-all bg-cream/10 dark:bg-cream-dark/5"
              >
                <div className="space-y-3">
                  {/* Photo container */}
                  <div className="aspect-[4/3] rounded-xl overflow-hidden shadow-sm relative">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 text-[9px] font-extrabold bg-primary text-cream px-2 py-0.5 rounded-full uppercase">
                      AI pick
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-textDark dark:text-cream truncate leading-tight group-hover:text-primary dark:group-hover:text-success-light transition-colors">
                      {p.name}
                    </h4>
                    <p className="text-[10px] text-textLight dark:text-cream/50 mt-0.5">{p.quantity} • ₹{p.price}</p>
                    <p className="text-[10px] text-textLight dark:text-cream/70 mt-1.5 line-clamp-2 leading-relaxed">
                      {p.description}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t border-accent/5">
                  <button
                    onClick={() => onQuickView(p)}
                    className="flex-1 py-2 rounded-full border border-accent/30 text-[10px] font-bold uppercase tracking-wider text-textDark dark:text-cream hover:bg-primary/5 transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onAddToCart(p)}
                    className="flex-1 py-2 bg-primary dark:bg-success hover:bg-primary-dark dark:hover:bg-success-dark text-cream rounded-full text-[10px] font-bold uppercase tracking-wider shadow-premium transition-all active:scale-95"
                  >
                    Quick Add
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>
    </section>
  );
}
