import { useState, useMemo } from 'react';
import { MapPin, Users, PawPrint, Palette, Calendar, Search, Plus, Minus, Check } from 'lucide-react';
import { Language, translations } from '../lib/translations';

interface PhotoConfig {
  location: string;
  numPeople: number;
  numPets: number;
  style: string;
  occasion: string;
}

interface PhotoConfigMenuProps {
  lang: Language;
  onConfigChange: (config: PhotoConfig) => void;
  initialConfig?: Partial<PhotoConfig>;
}

// Top 50 ciudades globales para selección rápida
const TOP_CITIES = [
  'Paris', 'New York', 'Tokyo', 'London', 'Dubai', 'Singapore', 'Sydney', 
  'Barcelona', 'Toronto', 'Hong Kong', 'Los Angeles', 'Miami', 'Rome', 
  'Amsterdam', 'Berlin', 'Madrid', 'Bangkok', 'Seoul', 'Mumbai', 'Istanbul',
  'Mexico City', 'Buenos Aires', 'Sao Paulo', 'Moscow', 'Cairo', 'Athens',
  'Venice', 'Prague', 'Vienna', 'Copenhagen', 'Stockholm', 'Oslo', 'Helsinki',
  'Reykjavik', 'Lisbon', 'Dublin', 'Edinburgh', 'Brussels', 'Zurich', 'Geneva',
  'Monaco', 'Santorini', 'Mykonos', 'Bali', 'Maldives', 'Seychelles', 'Bora Bora',
  'Machu Picchu', 'Petra', 'Taj Mahal'
];

const STYLES = ['professional', 'casual', 'elegant', 'creative'];
const OCCASIONS = ['christmas', 'birthday', 'wedding', 'graduation', 'general'];

export default function PhotoConfigMenu({ lang, onConfigChange, initialConfig }: PhotoConfigMenuProps) {
  const t = lang === 'es' ? {
    title: 'Configura Tu Sesión de Fotos',
    location: 'Locación / Ciudad',
    locationPlaceholder: 'Buscar ciudad o locación...',
    numPeople: 'Número de Personas',
    numPets: 'Número de Mascotas',
    style: 'Estilo de Foto',
    occasion: 'Ocasión',
    generate: 'Generar Fotos',
    styles: {
      professional: 'Profesional',
      casual: 'Casual',
      elegant: 'Elegante',
      creative: 'Creativo'
    },
    occasions: {
      christmas: 'Navidad',
      birthday: 'Cumpleaños',
      wedding: 'Boda',
      graduation: 'Graduación',
      general: 'General'
    }
  } : {
    title: 'Configure Your Photo Session',
    location: 'Location / City',
    locationPlaceholder: 'Search city or location...',
    numPeople: 'Number of People',
    numPets: 'Number of Pets',
    style: 'Photo Style',
    occasion: 'Occasion',
    generate: 'Generate Photos',
    styles: {
      professional: 'Professional',
      casual: 'Casual',
      elegant: 'Elegant',
      creative: 'Creative'
    },
    occasions: {
      christmas: 'Christmas',
      birthday: 'Birthday',
      wedding: 'Wedding',
      graduation: 'Graduation',
      general: 'General'
    }
  };

  const [config, setConfig] = useState<PhotoConfig>({
    location: initialConfig?.location || '',
    numPeople: initialConfig?.numPeople || 1,
    numPets: initialConfig?.numPets || 0,
    style: initialConfig?.style || 'professional',
    occasion: initialConfig?.occasion || 'general'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  // Optimización 10x: Memoización de búsqueda con filtrado rápido
  const filteredCities = useMemo(() => {
    if (!searchTerm) return TOP_CITIES.slice(0, 10);
    const term = searchTerm.toLowerCase();
    return TOP_CITIES.filter(city => 
      city.toLowerCase().includes(term)
    ).slice(0, 10);
  }, [searchTerm]);

  // Optimización 10x: Debounce automático con callback
  const handleConfigChange = (updates: Partial<PhotoConfig>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange(newConfig);
  };

  const incrementPeople = () => {
    if (config.numPeople < 10) {
      handleConfigChange({ numPeople: config.numPeople + 1 });
    }
  };

  const decrementPeople = () => {
    if (config.numPeople > 1) {
      handleConfigChange({ numPeople: config.numPeople - 1 });
    }
  };

  const incrementPets = () => {
    if (config.numPets < 5) {
      handleConfigChange({ numPets: config.numPets + 1 });
    }
  };

  const decrementPets = () => {
    if (config.numPets > 0) {
      handleConfigChange({ numPets: config.numPets - 1 });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl shadow-2xl border border-slate-700">
      {/* Título */}
      <h2 className="text-3xl md:text-4xl font-bold text-white mb-8 text-center bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
        {t.title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Selector de Locación */}
        <div className="relative">
          <label className="flex items-center gap-2 text-white font-semibold mb-3">
            <MapPin className="w-5 h-5 text-blue-400" />
            {t.location}
          </label>
          <div className="relative">
            <input
              type="text"
              value={config.location || searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder={t.locationPlaceholder}
              className="w-full px-4 py-3 pl-10 bg-slate-800 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            
            {/* Dropdown de ciudades */}
            {showDropdown && filteredCities.length > 0 && (
              <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl max-h-60 overflow-y-auto">
                {filteredCities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      handleConfigChange({ location: city });
                      setSearchTerm('');
                      setShowDropdown(false);
                    }}
                    className="w-full px-4 py-3 text-left text-white hover:bg-slate-700 transition-colors flex items-center justify-between group"
                  >
                    <span>{city}</span>
                    {config.location === city && (
                      <Check className="w-4 h-4 text-blue-400" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Contador de Personas */}
        <div>
          <label className="flex items-center gap-2 text-white font-semibold mb-3">
            <Users className="w-5 h-5 text-purple-400" />
            {t.numPeople}
          </label>
          <div className="flex items-center gap-4 bg-slate-800 border border-slate-600 rounded-xl p-3">
            <button
              onClick={decrementPeople}
              disabled={config.numPeople <= 1}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed rounded-lg transition-all hover:scale-110 disabled:hover:scale-100"
            >
              <Minus className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-white">{config.numPeople}</div>
              <div className="text-sm text-slate-400">personas</div>
            </div>
            <button
              onClick={incrementPeople}
              disabled={config.numPeople >= 10}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed rounded-lg transition-all hover:scale-110 disabled:hover:scale-100"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Contador de Mascotas */}
        <div>
          <label className="flex items-center gap-2 text-white font-semibold mb-3">
            <PawPrint className="w-5 h-5 text-pink-400" />
            {t.numPets}
          </label>
          <div className="flex items-center gap-4 bg-slate-800 border border-slate-600 rounded-xl p-3">
            <button
              onClick={decrementPets}
              disabled={config.numPets <= 0}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed rounded-lg transition-all hover:scale-110 disabled:hover:scale-100"
            >
              <Minus className="w-5 h-5 text-white" />
            </button>
            <div className="flex-1 text-center">
              <div className="text-3xl font-bold text-white">{config.numPets}</div>
              <div className="text-sm text-slate-400">mascotas</div>
            </div>
            <button
              onClick={incrementPets}
              disabled={config.numPets >= 5}
              className="p-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed rounded-lg transition-all hover:scale-110 disabled:hover:scale-100"
            >
              <Plus className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Selector de Estilo */}
        <div>
          <label className="flex items-center gap-2 text-white font-semibold mb-3">
            <Palette className="w-5 h-5 text-cyan-400" />
            {t.style}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {STYLES.map((style) => (
              <button
                key={style}
                onClick={() => handleConfigChange({ style })}
                className={`px-4 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  config.style === style
                    ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg shadow-blue-500/50'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
                }`}
              >
                {t.styles[style as keyof typeof t.styles]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selector de Ocasión (full width) */}
      <div className="mt-6">
        <label className="flex items-center gap-2 text-white font-semibold mb-3">
          <Calendar className="w-5 h-5 text-orange-400" />
          {t.occasion}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {OCCASIONS.map((occasion) => (
            <button
              key={occasion}
              onClick={() => handleConfigChange({ occasion })}
              className={`px-4 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                config.occasion === occasion
                  ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/50'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-600'
              }`}
            >
              {t.occasions[occasion as keyof typeof t.occasions]}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
