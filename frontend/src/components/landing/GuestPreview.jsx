import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import TempleSearch from './TempleSearch';
import AuthModal from '../auth/AuthModal';
import Button from '../shared/Button';

const GuestPreview = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-indigo-200/40 via-slate-100 to-rose-100/30" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[60vh] bg-gradient-to-b from-white via-transparent to-transparent" />

      <section className="container mx-auto px-4 py-20 lg:py-28">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center">
          <div className="relative">
            <div className="absolute -top-8 -left-10 h-32 w-32 rounded-full bg-gradient-to-br from-indigo-500/40 to-purple-500/20 blur-3xl" />
            <span className="inline-flex items-center rounded-full border border-indigo-200 bg-white/70 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600 shadow-lg shadow-indigo-200/40 backdrop-blur">
              Modern rituals for digital communities
            </span>
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Cultivate sacred connection with a luminous digital sanctuary.
            </h1>
            <p className="mt-6 text-lg text-slate-600">
              Temple3 elevates tenant-based spiritual communities with immersive storytelling, guided programming, and a welcoming portal that feels alive.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Button
                variant="primary"
                size="lg"
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 hover:from-indigo-600 hover:via-purple-600 hover:to-blue-600 shadow-xl shadow-indigo-200/60 border border-white/40"
                onClick={() => setShowAuthModal(true)}
              >
                Enter Temple Portal
              </Button>
              <button
                onClick={() => setShowAuthModal(true)}
                className="inline-flex items-center justify-center rounded-full border border-indigo-200/70 bg-white/60 px-6 py-3 text-base font-medium text-indigo-600 shadow-lg shadow-indigo-100/70 backdrop-blur transition hover:-translate-y-0.5"
              >
                Preview Experience
              </button>
            </div>
            <div className="mt-12 grid grid-cols-3 gap-6 text-center text-sm text-slate-600">
              <div className="rounded-3xl border border-white/60 bg-white/70 px-4 py-6 shadow-lg shadow-indigo-100/60 backdrop-blur">
                <p className="text-3xl font-semibold text-indigo-600">+42%</p>
                <p className="mt-1 text-xs uppercase tracking-widest">Engagement lift</p>
              </div>
              <div className="rounded-3xl border border-white/60 bg-white/70 px-4 py-6 shadow-lg shadow-indigo-100/60 backdrop-blur">
                <p className="text-3xl font-semibold text-indigo-600">24/7</p>
                <p className="mt-1 text-xs uppercase tracking-widest">Guided rituals</p>
              </div>
              <div className="rounded-3xl border border-white/60 bg-white/70 px-4 py-6 shadow-lg shadow-indigo-100/60 backdrop-blur">
                <p className="text-3xl font-semibold text-indigo-600">∞</p>
                <p className="mt-1 text-xs uppercase tracking-widest">Tenant expressions</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -right-12 top-8 h-64 w-64 rounded-full bg-gradient-to-bl from-rose-400/40 to-purple-500/20 blur-3xl" />
            <div className="relative rounded-3xl border border-white/60 bg-white/80 p-6 shadow-2xl shadow-indigo-200/60 backdrop-blur-xl">
              <div className="rounded-2xl border border-indigo-100/60 bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 p-6 text-white">
                <h2 className="text-xl font-semibold">Find your Temple</h2>
                <p className="mt-2 text-sm text-indigo-100">
                  Discover spaces aligned with your practices and join curated circles instantly.
                </p>
                <div className="mt-6 bg-white/15 rounded-2xl p-4 shadow-inner shadow-indigo-900/20">
                  <TempleSearch />
                </div>
              </div>
              <div className="mt-8 grid gap-4">
                {[{
                  title: 'Live ceremony streaming',
                  description: 'Crystal-clear broadcasts with integrated participation moments.',
                }, {
                  title: 'Living library collections',
                  description: 'Glassmorphic readers bring sacred texts and audio commentaries together.',
                }, {
                  title: 'Community constellations',
                  description: 'Map members, mentors, and guides with shimmering presence indicators.',
                }].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-lg shadow-indigo-100/60 backdrop-blur"
                  >
                    <h3 className="text-sm font-semibold text-slate-800">{item.title}</h3>
                    <p className="mt-1 text-xs text-slate-500">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 pb-24">
        <div className="rounded-3xl border border-white/60 bg-white/70 p-10 shadow-2xl shadow-indigo-100/60 backdrop-blur">
          <div className="grid gap-10 md:grid-cols-3">
            {[{
              title: 'Adaptive tenant theming',
              description: 'Glass-inspired palettes blend with each temple’s identity automatically.',
            }, {
              title: 'Mindful micro-interactions',
              description: 'Soothing animations guide your community through rituals and tasks.',
            }, {
              title: 'Accessible by design',
              description: 'High-contrast, keyboard-friendly navigation keeps the sanctuary open to all.',
            }].map((item) => (
              <div key={item.title} className="flex flex-col gap-3">
                <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-blue-500 text-white flex items-center justify-center text-lg font-semibold shadow-lg shadow-indigo-200/70">
                  ✶
                </div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="text-sm text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        initialMode="login"
      />
    </div>
  );
};

export default GuestPreview;
