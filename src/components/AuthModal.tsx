import { useState, useCallback, useMemo } from 'react';
import { X, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { Language } from '../lib/translations';
import { useAuth } from '../lib/hooks/useAuth';
import { validateLoginForm, validateRegisterForm } from '../lib/validation/validators';
import { showToast } from './Toast';

interface AuthModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export default function AuthModal({ lang, isOpen, onClose, initialMode = 'login' }: AuthModalProps) {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { handleSignIn, handleSignUp } = useAuth();

  const handleModeSwitch = useCallback(() => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError(null);
  }, [mode]);

  if (!isOpen) return null;

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Validate form data before submission
      if (mode === 'login') {
        const validation = validateLoginForm({ email, password });
        if (!validation.valid) {
          const errorMsg = validation.error || (lang === 'es' ? 'Datos inválidos' : 'Invalid data');
          setError(errorMsg);
          showToast(errorMsg, 'error');
          setLoading(false);
          return;
        }

        const { error } = await handleSignIn(email, password);
        if (error) {
          setError(error);
          showToast(error, 'error');
        } else {
          showToast(lang === 'es' ? 'Sesión iniciada exitosamente' : 'Successfully signed in', 'success');
          onClose();
          setEmail('');
          setPassword('');
        }
      } else {
        const validation = validateRegisterForm({ email, password, fullName: fullName || undefined });
        if (!validation.valid) {
          const errorMsg = validation.error || (lang === 'es' ? 'Datos inválidos' : 'Invalid data');
          setError(errorMsg);
          if (validation.errors) {
            // Show field-specific errors
            Object.values(validation.errors).forEach(err => showToast(err, 'error'));
          } else {
            showToast(errorMsg, 'error');
          }
          setLoading(false);
          return;
        }

        const { error } = await handleSignUp(email, password, fullName);
        if (error) {
          setError(error);
          showToast(error, 'error');
        } else {
          showToast(lang === 'es' ? 'Cuenta creada exitosamente' : 'Account created successfully', 'success');
          onClose();
          setEmail('');
          setPassword('');
          setFullName('');
        }
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : (lang === 'es' ? 'Ocurrió un error' : 'An error occurred');
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  }, [mode, email, password, fullName, lang, handleSignIn, handleSignUp, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 animate-in fade-in zoom-in duration-300">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
        >
          <X className="w-5 h-5 text-slate-600" />
        </button>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            {mode === 'login'
              ? lang === 'es'
                ? 'Iniciar Sesión'
                : 'Sign In'
              : lang === 'es'
              ? 'Crear Cuenta'
              : 'Create Account'}
          </h2>
          <p className="text-slate-600">
            {mode === 'login'
              ? lang === 'es'
                ? 'Accede a tu cuenta de Studio Nexora'
                : 'Access your Studio Nexora account'
              : lang === 'es'
              ? 'Crea tu cuenta y comienza a generar fotos profesionales'
              : 'Create your account and start generating professional photos'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                {lang === 'es' ? 'Nombre Completo' : 'Full Name'}
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  placeholder={lang === 'es' ? 'Juan Pérez' : 'John Doe'}
                  required
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {lang === 'es' ? 'Correo Electrónico' : 'Email'}
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder={lang === 'es' ? 'tu@email.com' : 'your@email.com'}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              {lang === 'es' ? 'Contraseña' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                placeholder={lang === 'es' ? '••••••••' : '••••••••'}
                required
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-4 rounded-xl font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            {loading
              ? lang === 'es'
                ? 'Procesando...'
                : 'Processing...'
              : mode === 'login'
              ? lang === 'es'
                ? 'Iniciar Sesión'
                : 'Sign In'
              : lang === 'es'
              ? 'Crear Cuenta'
              : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={handleModeSwitch}
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            {mode === 'login'
              ? lang === 'es'
                ? '¿No tienes cuenta? Regístrate'
                : "Don't have an account? Sign up"
              : lang === 'es'
              ? '¿Ya tienes cuenta? Inicia sesión'
              : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}

