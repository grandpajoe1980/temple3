const Footer = () => {
  return (
    <footer className="mt-auto bg-gradient-to-r from-slate-900 via-indigo-900 to-slate-900 text-slate-100">
      <div className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div>
            <h3 className="text-lg font-semibold tracking-tight">Temple3</h3>
            <p className="mt-3 text-sm text-slate-300">
              A modern sanctuary crafted to deepen community, nurture rituals, and bring timeless wisdom to daily practice.
            </p>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Explore</h4>
            <nav className="mt-4 flex flex-col gap-2 text-sm text-slate-300">
              <a href="#" className="transition-colors hover:text-white">Community Manifesto</a>
              <a href="#" className="transition-colors hover:text-white">Spiritual Programs</a>
              <a href="#" className="transition-colors hover:text-white">Volunteer Portal</a>
              <a href="#" className="transition-colors hover:text-white">Support Center</a>
            </nav>
          </div>
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-slate-400">Stay in the circle</h4>
            <p className="mt-3 text-sm text-slate-300">
              Receive curated teachings and event highlights.
            </p>
            <form className="mt-4 flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm text-white placeholder:text-slate-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <button
                type="button"
                className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-blue-500 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-indigo-900/40 transition-transform hover:-translate-y-0.5"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
        <div className="mt-10 flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 text-xs text-slate-400">
          <p>© {new Date().getFullYear()} Temple3. Illuminating together.</p>
          <div className="mt-4 md:mt-0 flex flex-wrap gap-4">
            <a href="#" className="hover:text-white">Privacy</a>
            <a href="#" className="hover:text-white">Terms</a>
            <a href="#" className="hover:text-white">Accessibility</a>
            <a href="#" className="hover:text-white">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
