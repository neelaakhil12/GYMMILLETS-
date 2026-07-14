import React, { useEffect, useState } from 'react';

export default function Splash({ onComplete }) {
  const [phase, setPhase] = useState('entry'); // entry -> split -> logo -> exit

  useEffect(() => {
    // Phase 1: Entry holds for 1.8 seconds.
    const splitTimer = setTimeout(() => {
      setPhase('split');
    }, 1800);

    // Phase 2: Semicircles dismantle and split. After 1s of split, show the Logo.
    const logoTimer = setTimeout(() => {
      setPhase('logo');
    }, 2800);

    // Phase 3: Logo reveals. Holds for 1.5 seconds.
    const exitTimer = setTimeout(() => {
      setPhase('exit');
    }, 4300);

    // Phase 4: Screen exit animations complete. After 0.7s, complete the splash.
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearTimeout(splitTimer);
      clearTimeout(logoTimer);
      clearTimeout(exitTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-primary dark:bg-primary-dark transition-all duration-700 ease-in-out select-none pointer-events-auto ${
        phase === 'exit' ? 'opacity-0 -translate-y-full' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="relative w-72 h-72 flex items-center justify-center">
        {/* Left half of the Circle */}
        <div
          className={`absolute top-0 right-1/2 w-36 h-72 border-[6px] border-cream dark:border-accent border-r-0 rounded-l-full origin-right transition-all ${
            phase === 'entry' ? 'opacity-100' : 'animate-split-left'
          }`}
        />

        {/* Right half of the Circle */}
        <div
          className={`absolute top-0 left-1/2 w-36 h-72 border-[6px] border-cream dark:border-accent border-l-0 rounded-r-full origin-left transition-all ${
            phase === 'entry' ? 'opacity-100' : 'animate-split-right'
          }`}
        />

        {/* Website Name text: GYMILLETS */}
        <div
          className={`absolute font-outfit font-black uppercase text-2xl tracking-[0.25em] text-cream dark:text-accent text-center transition-all ${
            phase === 'entry' ? 'opacity-100 scale-100' : 'animate-text-exit'
          }`}
        >
          GYMILLETS
        </div>

        {/* Branded Logo Reveal */}
        {(phase === 'logo' || phase === 'exit') && (
          <img
            src="/logo.png"
            alt="GymMillets Logo"
            className="absolute w-44 h-44 object-contain rounded-full animate-logo-reveal"
          />
        )}
      </div>
    </div>
  );
}
