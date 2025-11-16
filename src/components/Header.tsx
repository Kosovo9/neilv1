import { Menu, X, Globe } from 'lucide-react';
import { useState } from 'react';
import { Language } from '../lib/translations';
import NexoraLogo from './NexoraLogo';

interface HeaderProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  onGetStarted?: () => void;
}

export default function Header({ lang, onLanguageChange, onGetStarted }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const menuItems = [
    { label: lang === 'es' ? 'Precios' : 'Pricing', href: '#pricing' },
    { label: lang === 'es' ? 'Cómo Funciona' : 'How It Works', href: '#how-it-works' },
    { label: lang === 'es' ? 'Ejemplos' : 'Examples', href: '#samples' },
    { label: lang === 'es' ? 'Afiliados' : 'Affiliates', href: '#affiliates' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          <div className="flex items-center gap-4">
            <NexoraLogo size="md" showText={false} className="flex-shrink-0" />
            <div className="flex flex-col">
              <span className="text-2xl font-extrabold text-white leading-tight">Studio Nexora</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-10">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="text-white hover:text-blue-300 font-semibold text-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-5">
            <div className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-white" />
              <div className="flex gap-1">
                <button
                  onClick={() => onLanguageChange('es')}
                  className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                    lang === 'es'
                      ? 'bg-blue-400 text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => onLanguageChange('en')}
                  className={`px-3 py-1.5 rounded text-sm font-semibold transition-colors ${
                    lang === 'en'
                      ? 'bg-blue-400 text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>

            <button
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all shadow-lg hover:shadow-xl"
            >
              {lang === 'es' ? 'Comenzar' : 'Get Started'}
            </button>
          </div>

          <button
            className="md:hidden text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-white/10">
          <div className="px-4 py-4 space-y-4">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="block text-white hover:text-blue-300 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center gap-2 pt-4 border-t border-white/10">
              <Globe className="w-5 h-5 text-white" />
              <div className="flex gap-1">
                <button
                  onClick={() => onLanguageChange('es')}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    lang === 'es'
                      ? 'bg-blue-400 text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  ES
                </button>
                <button
                  onClick={() => onLanguageChange('en')}
                  className={`px-3 py-1.5 rounded text-sm font-medium ${
                    lang === 'en'
                      ? 'bg-blue-400 text-white'
                      : 'text-white/70 hover:text-white'
                  }`}
                >
                  EN
                </button>
              </div>
            </div>
            <button
              onClick={() => {
                onGetStarted?.();
                setMobileMenuOpen(false);
              }}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-3 rounded-lg font-bold text-lg transition-all"
            >
              {lang === 'es' ? 'Comenzar' : 'Get Started'}
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
