import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { useMember } from '@/integrations';
import { motion, AnimatePresence } from 'framer-motion';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { member, isAuthenticated, isLoading, actions } = useMember();

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/watchlist', label: 'Watchlist' },
    { path: '/community', label: 'Community' }
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-primary text-primary-foreground sticky top-0 z-50 border-b border-primary-foreground border-opacity-10">
      <div className="max-w-[100rem] mx-auto px-8 md:px-16 py-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="font-heading text-2xl md:text-3xl tracking-wider text-accentcyan">
              COSMIC WATCH
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-paragraph text-base transition-colors ${
                  isActive(link.path)
                    ? 'text-accentcyan'
                    : 'text-primary-foreground hover:text-accentcyan'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Section */}
          <div className="hidden lg:flex items-center gap-4">
            {isLoading ? (
              <div className="w-8 h-8 border-2 border-accentcyan border-t-transparent rounded-full animate-spin"></div>
            ) : isAuthenticated ? (
              <>
                <Link
                  to="/profile"
                  className="flex items-center gap-2 font-paragraph text-base text-primary-foreground hover:text-accentcyan transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span>{member?.profile?.nickname || 'Profile'}</span>
                </Link>
                <button
                  onClick={actions.logout}
                  className="font-paragraph text-base px-6 py-2 rounded-full border-2 border-accentcyan text-accentcyan hover:bg-accentcyan hover:text-primary transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={actions.login}
                className="font-paragraph text-base px-6 py-2 rounded-full bg-accentcyan text-primary hover:bg-opacity-90 transition-all"
              >
                Sign In
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-primary-foreground"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="lg:hidden mt-6 pt-6 border-t border-primary-foreground border-opacity-10"
            >
              <nav className="flex flex-col gap-4 mb-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setIsMenuOpen(false)}
                    className={`font-paragraph text-base transition-colors ${
                      isActive(link.path)
                        ? 'text-accentcyan'
                        : 'text-primary-foreground hover:text-accentcyan'
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
              
              <div className="flex flex-col gap-3 pt-4 border-t border-primary-foreground border-opacity-10">
                {isLoading ? (
                  <div className="w-8 h-8 border-2 border-accentcyan border-t-transparent rounded-full animate-spin"></div>
                ) : isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 font-paragraph text-base text-primary-foreground hover:text-accentcyan transition-colors"
                    >
                      <User className="w-5 h-5" />
                      <span>{member?.profile?.nickname || 'Profile'}</span>
                    </Link>
                    <button
                      onClick={() => {
                        actions.logout();
                        setIsMenuOpen(false);
                      }}
                      className="font-paragraph text-base px-6 py-2 rounded-full border-2 border-accentcyan text-accentcyan hover:bg-accentcyan hover:text-primary transition-all text-left"
                    >
                      Sign Out
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      actions.login();
                      setIsMenuOpen(false);
                    }}
                    className="font-paragraph text-base px-6 py-2 rounded-full bg-accentcyan text-primary hover:bg-opacity-90 transition-all"
                  >
                    Sign In
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
