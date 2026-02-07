import { Link } from 'react-router-dom';
import { Github, Telescope, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-primary text-primary-foreground">
      <div className="max-w-[100rem] mx-auto px-8 md:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div>
            <div className="font-heading text-2xl tracking-wider text-accentcyan mb-4">
              COSMIC WATCH
            </div>
            <p className="font-paragraph text-base text-primary-foreground opacity-80 leading-relaxed">
              Real-time Near-Earth Object monitoring platform for researchers, enthusiasts, and space safety awareness.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="font-heading text-xl mb-4 text-accentcyan">Navigation</h3>
            <ul className="space-y-3">
              {[
                { path: '/', label: 'Home' },
                { path: '/dashboard', label: 'Dashboard' },
                { path: '/watchlist', label: 'Watchlist' },
                { path: '/community', label: 'Community' }
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="font-paragraph text-base text-primary-foreground opacity-80 hover:text-accentcyan hover:opacity-100 transition-all"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-heading text-xl mb-4 text-accentcyan">Resources</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://api.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-paragraph text-base text-primary-foreground opacity-80 hover:text-accentcyan hover:opacity-100 transition-all"
                >
                  NASA NeoWs API
                </a>
              </li>
              <li>
                <a
                  href="https://cneos.jpl.nasa.gov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-paragraph text-base text-primary-foreground opacity-80 hover:text-accentcyan hover:opacity-100 transition-all"
                >
                  CNEOS Database
                </a>
              </li>
              <li>
                <a
                  href="https://www.iau.org/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-paragraph text-base text-primary-foreground opacity-80 hover:text-accentcyan hover:opacity-100 transition-all"
                >
                  IAU Minor Planet Center
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-heading text-xl mb-4 text-accentcyan">Connect</h3>
            <div className="flex gap-4 mb-6">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-accentcyan text-primary flex items-center justify-center hover:bg-opacity-80 transition-all"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="mailto:contact@cosmicwatch.space"
                className="w-10 h-10 rounded-full bg-accentcyan text-primary flex items-center justify-center hover:bg-opacity-80 transition-all"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full bg-accentcyan text-primary flex items-center justify-center hover:bg-opacity-80 transition-all"
                aria-label="Observatory"
              >
                <Telescope className="w-5 h-5" />
              </a>
            </div>
            <p className="font-paragraph text-sm text-primary-foreground opacity-70">
              Data sourced from NASA's Near-Earth Object Web Service
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-primary-foreground border-opacity-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="font-paragraph text-sm text-primary-foreground opacity-70">
              © {new Date().getFullYear()} Cosmic Watch. Advancing space safety awareness.
            </p>
            <div className="flex gap-6">
              <a
                href="#"
                className="font-paragraph text-sm text-primary-foreground opacity-70 hover:text-accentcyan hover:opacity-100 transition-all"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="font-paragraph text-sm text-primary-foreground opacity-70 hover:text-accentcyan hover:opacity-100 transition-all"
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
