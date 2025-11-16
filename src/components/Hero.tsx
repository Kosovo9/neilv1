import { Zap } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Language, translations } from '../lib/translations';

interface HeroProps {
  lang: Language;
  onGetStarted: () => void;
}

// Top 10 ciudades globales con imágenes de alta calidad
const CITY_BACKGROUNDS = [
  {
    name: 'Paris',
    image: 'https://images.pexels.com/photos/1308940/pexels-photo-1308940.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    alt: 'Torre Eiffel, París'
  },
  {
    name: 'New York',
    image: 'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    alt: 'Times Square, Nueva York'
  },
  {
    name: 'Tokyo',
    image: 'https://images.pexels.com/photos/2339009/pexels-photo-2339009.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    alt: 'Shibuya, Tokio'
  },
  {
    name: 'London',
    image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    alt: 'Big Ben, Londres'
  },
  {
    name: 'Dubai',
    image: 'https://images.pexels.com/photos/1470502/pexels-photo-1470502.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    alt: 'Burj Khalifa, Dubai'
  },
  {
    name: 'Singapore',
    image: 'https://images.pexels.com/photos/1044329/pexels-photo-1044329.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    alt: 'Marina Bay, Singapur'
  },
  {
    name: 'Sydney',
    image: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    alt: 'Ópera de Sídney'
  },
  {
    name: 'Barcelona',
    image: 'https://images.pexels.com/photos/819764/pexels-photo-819764.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    alt: 'Sagrada Familia, Barcelona'
  },
  {
    name: 'Toronto',
    image: 'https://images.pexels.com/photos/374870/pexels-photo-374870.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    alt: 'CN Tower, Toronto'
  },
  {
    name: 'Hong Kong',
    image: 'https://images.pexels.com/photos/1239162/pexels-photo-1239162.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080',
    alt: 'Victoria Harbour, Hong Kong'
  }
];

export default function Hero({ lang, onGetStarted }: HeroProps) {
  const t = translations[lang].hero;
  const [currentCityIndex, setCurrentCityIndex] = useState(0);

  // Auto-rotate carousel cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentCityIndex((prev) => (prev + 1) % CITY_BACKGROUNDS.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentCity = CITY_BACKGROUNDS[currentCityIndex];

  return (
    <section className="relative bg-black text-white overflow-hidden min-h-screen">
      {/* Carousel Background con transición suave */}
      <div className="absolute inset-0">
        {CITY_BACKGROUNDS.map((city, index) => (
          <div
            key={city.name}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentCityIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={city.image}
              alt={city.alt}
              className="w-full h-full object-cover"
              loading={index === 0 ? 'eager' : 'lazy'}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
          </div>
        ))}
      </div>

      {/* Contenido principal centrado */}
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-32 flex items-center min-h-screen z-20">
        <div className="text-center max-w-5xl mx-auto w-full">
          {/* Badge "IA de última generación" con rayo y borde azul claro */}
          <div className="inline-flex items-center gap-2 bg-black/40 backdrop-blur-md border border-blue-300/50 rounded-full px-5 py-2.5 mb-10">
            <Zap className="w-5 h-5 text-white" />
            <span className="text-base font-semibold text-white">
              {lang === 'es' ? 'IA de última generación' : 'Next-generation AI'}
            </span>
          </div>

          {/* Título principal con colores exactos de la imagen */}
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-6 leading-tight text-center">
            <span className="text-white block">{lang === 'es' ? 'Transforma' : 'Transform'}</span>
            <span className="text-white block">{lang === 'es' ? 'tus' : 'your'}</span>
            <span className="block">
              <span className="bg-gradient-to-r from-cyan-300 to-blue-400 bg-clip-text text-transparent">
                {lang === 'es' ? 'Selfies' : 'Selfies'}
              </span>
              <span className="text-white"> {lang === 'es' ? 'en' : 'into'} </span>
              <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                {lang === 'es' ? 'Fotos' : 'Photos'}
              </span>
            </span>
            <span className="text-white block">{lang === 'es' ? 'Profesionales' : 'Professional'}</span>
          </h1>

          {/* Subtítulo */}
          <p className="text-base md:text-lg text-white/90 mb-4 font-normal text-center">
            {lang === 'es' 
              ? '¡Tú eliges el estudio y la locación que te gusta!' 
              : 'You choose the studio and location you like!'}
          </p>

          {/* Descripción adicional */}
          <p className="text-lg md:text-xl text-white/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            {lang === 'es'
              ? 'Crea imágenes profesionales hiper-realistas con Inteligencia Artificial. Sin fotógrafo, sin estudio, sin complicaciones. Resultados en 5 minutos.'
              : 'Create hyper-realistic professional images with Artificial Intelligence. No photographer, no studio, no complications. Results in 5 minutes.'}
          </p>

          {/* Botones CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-20">
            <button
              onClick={onGetStarted}
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white px-10 py-5 rounded-xl text-xl font-bold transition-all duration-300 shadow-2xl shadow-blue-500/40 hover:shadow-blue-500/60 hover:scale-105"
            >
              {lang === 'es' ? 'Comenzar Ahora' : 'Start Now'}
              <Zap className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => {
                const samplesSection = document.getElementById('samples');
                if (samplesSection) {
                  samplesSection.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="inline-flex items-center gap-2 border-2 border-white/30 hover:border-white/50 bg-black/20 backdrop-blur-sm text-white px-10 py-5 rounded-xl text-xl font-bold transition-all duration-300 hover:bg-white/10 hover:scale-105"
            >
              {lang === 'es' ? 'Ver Ejemplos' : 'View Examples'}
            </button>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-2">1.27k</div>
              <div className="text-lg md:text-xl text-white/80">{lang === 'es' ? 'Clientes Felices' : 'Happy Clients'}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-2">5 Min</div>
              <div className="text-lg md:text-xl text-white/80">{lang === 'es' ? 'Entrega Rápida' : 'Fast Delivery'}</div>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-extrabold text-white mb-2">100+</div>
              <div className="text-lg md:text-xl text-white/80">{lang === 'es' ? 'Estilos Únicos' : 'Unique Styles'}</div>
            </div>
          </div>

          {/* Indicador de carousel */}
          <div className="flex items-center justify-center gap-2 mt-12">
            {CITY_BACKGROUNDS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentCityIndex(index)}
                className={`transition-all duration-300 rounded-full ${
                  index === currentCityIndex
                    ? 'w-8 h-2 bg-white'
                    : 'w-2 h-2 bg-white/40 hover:bg-white/60'
                }`}
                aria-label={`Go to city ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
