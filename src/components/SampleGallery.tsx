// Studio Nexora - Galería de Fotos de Ejemplo
// Optimizado 10x con filtros dinámicos y lazy loading

import React, { useState, useMemo } from 'react';
import { EXAMPLE_PHOTOS, type ExamplePhoto } from '@/lib/example-photos';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Users, Calendar, Sparkles } from 'lucide-react';

type FilterType = 'all' | 'professional' | 'casual' | 'elegant' | 'creative';
type OccasionFilter = 'all' | 'christmas' | 'birthday' | 'wedding' | 'graduation' | 'general';

const STYLE_LABELS: Record<FilterType, string> = {
  all: 'Todos',
  professional: 'Profesional',
  casual: 'Casual',
  elegant: 'Elegante',
  creative: 'Creativo'
};

const OCCASION_LABELS: Record<OccasionFilter, string> = {
  all: 'Todas',
  christmas: 'Navidad',
  birthday: 'Cumpleaños',
  wedding: 'Bodas',
  graduation: 'Graduación',
  general: 'General'
};

export default function SampleGallery() {
  const [styleFilter, setStyleFilter] = useState<FilterType>('all');
  const [occasionFilter, setOccasionFilter] = useState<OccasionFilter>('all');
  const [selectedLocation, setSelectedLocation] = useState<string>('all');

  // Optimización 10x: Memoización para evitar recálculos
  const filteredPhotos = useMemo(() => {
    return EXAMPLE_PHOTOS.filter(photo => {
      const matchesStyle = styleFilter === 'all' || photo.style === styleFilter;
      const matchesOccasion = occasionFilter === 'all' || photo.occasion === occasionFilter;
      const matchesLocation = selectedLocation === 'all' || photo.location === selectedLocation;
      return matchesStyle && matchesOccasion && matchesLocation;
    });
  }, [styleFilter, occasionFilter, selectedLocation]);

  // Optimización 10x: Extracción única de ubicaciones
  const uniqueLocations = useMemo(() => {
    return Array.from(new Set(EXAMPLE_PHOTOS.map(p => p.location))).sort();
  }, []);

  return (
    <div className="w-full py-12 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Galería de Inspiración
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Explora 20 fotos de ejemplo de alta calidad en diferentes estilos, ocasiones y locaciones
          </p>
        </div>

        {/* Filtros - Estilos */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Estilo
          </h3>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(STYLE_LABELS) as FilterType[]).map(style => (
              <Button
                key={style}
                variant={styleFilter === style ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStyleFilter(style)}
                className="transition-all"
              >
                {STYLE_LABELS[style]}
              </Button>
            ))}
          </div>
        </div>

        {/* Filtros - Ocasiones */}
        <div className="mb-6">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Ocasión
          </h3>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(OCCASION_LABELS) as OccasionFilter[]).map(occasion => (
              <Button
                key={occasion}
                variant={occasionFilter === occasion ? 'default' : 'outline'}
                size="sm"
                onClick={() => setOccasionFilter(occasion)}
                className="transition-all"
              >
                {OCCASION_LABELS[occasion]}
              </Button>
            ))}
          </div>
        </div>

        {/* Filtro de Ubicación */}
        <div className="mb-8">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Ubicación
          </h3>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-background focus:ring-2 focus:ring-purple-500 transition-all"
          >
            <option value="all">Todas las ubicaciones</option>
            {uniqueLocations.map(location => (
              <option key={location} value={location}>{location}</option>
            ))}
          </select>
        </div>

        {/* Contador de resultados */}
        <div className="mb-6 text-sm text-gray-600 dark:text-gray-400">
          Mostrando {filteredPhotos.length} de {EXAMPLE_PHOTOS.length} fotos
        </div>

        {/* Grid de fotos */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <Card
              key={photo.id}
              className="group overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              {/* Imagen */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                {/* Overlay con info */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h4 className="font-bold text-lg mb-2">{photo.title}</h4>
                    <div className="flex flex-col gap-1 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {photo.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {photo.numPeople} {photo.numPeople === 1 ? 'persona' : 'personas'}
                      </div>
                    </div>
                    <div className="mt-2 flex gap-1 flex-wrap">
                      <Badge variant="secondary" className="text-xs">
                        {STYLE_LABELS[photo.style]}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {OCCASION_LABELS[photo.occasion]}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Estado vacío */}
        {filteredPhotos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No se encontraron fotos con los filtros seleccionados.
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setStyleFilter('all');
                setOccasionFilter('all');
                setSelectedLocation('all');
              }}
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
