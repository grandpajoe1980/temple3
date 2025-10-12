import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="relative min-h-screen flex flex-col bg-transparent">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent blur-3xl" />
        <div className="absolute bottom-0 left-0 h-64 w-64 rounded-full bg-gradient-to-tr from-rose-400/20 via-purple-400/10 to-transparent blur-3xl" />
        <div className="absolute -bottom-40 right-0 h-80 w-80 rounded-full bg-gradient-to-tl from-sky-400/10 via-cyan-400/5 to-transparent blur-3xl" />
      </div>
      <Header />
      <main className="relative flex-1">
        <div className="relative z-10">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
