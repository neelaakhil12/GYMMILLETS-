import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Shield, AlertCircle, ArrowLeft } from 'lucide-react';

const ADMIN_EMAIL    = 'admin@gymmillets.com';
const ADMIN_PASSWORD = 'GymAdmin@2026';

export default function AdminLogin({ onLogin, onBack }) {
  const [form, setForm]             = useState({ email: '', password: '' });
  const [showPassword, setShowPw]   = useState(false);
  const [error, setError]           = useState('');
  const [loading, setLoading]       = useState(false);
  const [attempts, setAttempts]     = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (attempts >= 5) { setError('Too many attempts. Refresh the page to try again.'); return; }
    setError('');
    setLoading(true);
    // Simulate async auth check
    setTimeout(() => {
      if (form.email.trim().toLowerCase() === ADMIN_EMAIL && form.password === ADMIN_PASSWORD) {
        onLogin();
      } else {
        setAttempts(a => a + 1);
        setError('Invalid credentials. Please try again.');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#060608] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient glow background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/12 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-success/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-secondary/5 rounded-full blur-[80px]" />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] bg-[size:40px_40px]" />
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Back button */}
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-white/40 hover:text-white/70 font-bold text-xs mb-6 transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Back to Store</span>
          </button>
        )}

        {/* Brand header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl border border-primary/25 shadow-[0_0_60px_rgba(76,175,80,0.2)] mb-5"
               style={{ background: 'linear-gradient(135deg, rgba(76,175,80,0.2) 0%, rgba(76,175,80,0.05) 100%)' }}>
            <Shield className="text-primary" size={34} />
          </div>
          <h1 className="text-3xl font-outfit font-black text-white tracking-tight">GymMillets</h1>
          <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-white/30 mt-2">
            Admin Control Panel
          </p>
        </div>

        {/* Login card */}
        <div className="relative rounded-3xl border border-white/8 overflow-hidden"
             style={{ background: 'rgba(15,15,20,0.95)', backdropFilter: 'blur(40px)' }}>
          {/* Top accent line */}
          <div className="h-0.5 w-full bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

          <div className="p-8">
            <h2 className="text-xl font-outfit font-black text-white mb-1">Secure Access</h2>
            <p className="text-xs text-white/35 font-medium mb-7">Enter your admin credentials to access the dashboard.</p>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/35 mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                  <input
                    type="email"
                    required
                    autoComplete="username"
                    value={form.email}
                    onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="admin@gymmillets.com"
                    className="w-full bg-white/5 border border-white/8 hover:border-white/15 focus:border-primary/50 focus:bg-white/7 rounded-2xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-white/15 font-medium transition-all outline-none"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-[0.15em] text-white/35 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={form.password}
                    onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
                    placeholder="••••••••••••"
                    className="w-full bg-white/5 border border-white/8 hover:border-white/15 focus:border-primary/50 focus:bg-white/7 rounded-2xl pl-10 pr-12 py-3 text-sm text-white placeholder:text-white/15 font-medium transition-all outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(v => !v)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/60 transition-colors p-1"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 rounded-2xl px-4 py-3">
                  <AlertCircle size={14} className="text-red-400 shrink-0" />
                  <p className="text-xs font-bold text-red-400">{error}</p>
                </div>
              )}

              {/* Attempts warning */}
              {attempts > 2 && attempts < 5 && (
                <p className="text-[10px] text-yellow-400/70 font-bold text-center">
                  ⚠️ {5 - attempts} attempt{5 - attempts !== 1 ? 's' : ''} remaining
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || attempts >= 5}
                className="w-full disabled:opacity-50 disabled:cursor-not-allowed text-cream font-black py-3.5 rounded-2xl text-sm transition-all active:scale-95 mt-2 flex items-center justify-center gap-2"
                style={{
                  background: 'linear-gradient(135deg, #5a8f5c 0%, #4caf50 100%)',
                  boxShadow: '0 0 30px rgba(76,175,80,0.3)'
                }}
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <Shield size={15} />
                    <span>Access Admin Panel</span>
                  </>
                )}
              </button>
            </form>

            {/* Footer */}
            <div className="mt-7 pt-5 border-t border-white/6 text-center space-y-1">
              <p className="text-[9px] font-extrabold text-white/20 uppercase tracking-[0.2em]">
                🔒 Restricted · GymMillets Secure HQ
              </p>
              <p className="text-[9px] text-white/12">Unauthorized access is prohibited and monitored.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
