// Studio Nexora - 20 Fotos de Ejemplo de Alta Calidad
// Optimizadas para web con Pexels CDN

export interface ExamplePhoto {
  id: string;
  title: string;
  url: string;
  location: string;
  style: 'professional' | 'casual' | 'elegant' | 'creative';
  occasion: 'christmas' | 'birthday' | 'wedding' | 'graduation' | 'general';
  numPeople: number;
}

export const EXAMPLE_PHOTOS: ExamplePhoto[] = [
  { id: '1', title: 'Navidad en NYC', url: 'https://images.pexels.com/photos/1303084/pexels-photo-1303084.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'New York', style: 'elegant', occasion: 'christmas', numPeople: 2 },
  { id: '2', title: 'Profesional París', url: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Paris', style: 'professional', occasion: 'general', numPeople: 1 },
  { id: '3', title: 'Boda Santorini', url: 'https://images.pexels.com/photos/2253870/pexels-photo-2253870.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Santorini', style: 'elegant', occasion: 'wedding', numPeople: 2 },
  { id: '4', title: 'Casual Tokyo', url: 'https://images.pexels.com/photos/1121796/pexels-photo-1121796.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Tokyo', style: 'casual', occasion: 'general', numPeople: 1 },
  { id: '5', title: 'Graduación Londres', url: 'https://images.pexels.com/photos/1205651/pexels-photo-1205651.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'London', style: 'professional', occasion: 'graduation', numPeople: 1 },
  { id: '6', title: 'Creativo Dubai', url: 'https://images.pexels.com/photos/1382731/pexels-photo-1382731.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Dubai', style: 'creative', occasion: 'general', numPeople: 1 },
  { id: '7', title: 'Cumpleaños Barcelona', url: 'https://images.pexels.com/photos/1488315/pexels-photo-1488315.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Barcelona', style: 'casual', occasion: 'birthday', numPeople: 3 },
  { id: '8', title: 'Corporativo Singapur', url: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Singapore', style: 'professional', occasion: 'general', numPeople: 1 },
  { id: '9', title: 'Elegante Venecia', url: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Venice', style: 'elegant', occasion: 'general', numPeople: 2 },
  { id: '10', title: 'Navidad Toronto', url: 'https://images.pexels.com/photos/1670723/pexels-photo-1670723.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Toronto', style: 'casual', occasion: 'christmas', numPeople: 4 },
  { id: '11', title: 'Creativo Sídney', url: 'https://images.pexels.com/photos/1388030/pexels-photo-1388030.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Sydney', style: 'creative', occasion: 'general', numPeople: 1 },
  { id: '12', title: 'Boda Bali', url: 'https://images.pexels.com/photos/1024993/pexels-photo-1024993.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Bali', style: 'elegant', occasion: 'wedding', numPeople: 2 },
  { id: '13', title: 'Profesional Madrid', url: 'https://images.pexels.com/photos/1065084/pexels-photo-1065084.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Madrid', style: 'professional', occasion: 'general', numPeople: 1 },
  { id: '14', title: 'Fiesta Miami', url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Miami', style: 'casual', occasion: 'birthday', numPeople: 5 },
  { id: '15', title: 'Urbano Hong Kong', url: 'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Hong Kong', style: 'creative', occasion: 'general', numPeople: 1 },
  { id: '16', title: 'Graduación Roma', url: 'https://images.pexels.com/photos/1250643/pexels-photo-1250643.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Rome', style: 'professional', occasion: 'graduation', numPeople: 1 },
  { id: '17', title: 'Elegante Ámsterdam', url: 'https://images.pexels.com/photos/1139556/pexels-photo-1139556.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Amsterdam', style: 'elegant', occasion: 'general', numPeople: 2 },
  { id: '18', title: 'Navidad Nórdica', url: 'https://images.pexels.com/photos/1576073/pexels-photo-1576073.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Reykjavik', style: 'creative', occasion: 'christmas', numPeople: 2 },
  { id: '19', title: 'Casual Berlín', url: 'https://images.pexels.com/photos/1139317/pexels-photo-1139317.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Berlin', style: 'casual', occasion: 'general', numPeople: 3 },
  { id: '20', title: 'Boda Maldivas', url: 'https://images.pexels.com/photos/1024967/pexels-photo-1024967.jpeg?auto=compress&cs=tinysrgb&w=800', location: 'Maldives', style: 'elegant', occasion: 'wedding', numPeople: 2 }
];
