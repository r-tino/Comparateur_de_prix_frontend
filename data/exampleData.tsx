// /data/exampleData.tsx

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  brand: string;
}

export const products: Product[] = [
  { id: '1', name: 'Téléphone XYZ', price: 500000, image: '/images/smartphone.jpg', category: 'Électronique', brand: 'TechCo' },
  { id: '2', name: 'Ordinateur Portable ABC', price: 1500000, image: '/images/laptop.jpg', category: 'Électronique', brand: 'CompuTech' },
  { id: '3', name: 'Casque Gameur', price: 900000, image: '/images/casque.jpg', category: 'Électronique', brand: 'AudioPro' },
  { id: '4', name: 'Montre Led', price: 1200000, image: '/images/montre.jpg', category: 'Électronique', brand: 'TimeMaster' },
  { id: '5', name: 'Tablette Pro', price: 800000, image: '/images/tablet.png', category: 'Électronique', brand: 'TechCo' },
  { id: '6', name: 'Enceinte Bluetooth', price: 300000, image: '/images/speaker.png', category: 'Électronique', brand: 'SoundWave' },
  { id: '7', name: 'Appareil Photo DSLR', price: 2000000, image: '/images/camera.jpg', category: 'Électronique', brand: 'PhotoPro' },
  { id: '8', name: 'Console de Jeu NextGen', price: 1800000, image: '/images/console.jpg', category: 'Électronique', brand: 'GameMaster' },
  { id: '9', name: 'Drone 4K', price: 1300000, image: '/images/drone.jpg', category: 'Électronique', brand: 'SkyView' },
  { id: '10', name: 'Écouteurs Sans Fil', price: 450000, image: '/images/earbuds.jpg', category: 'Électronique', brand: 'AudioPro' },
];

export const categories = [
  { id: 'electronics', name: 'Électronique' },
  { id: 'fashion', name: 'Mode' },
  { id: 'home', name: 'Maison' },
  { id: 'beauty', name: 'Beauté' },
  { id: 'sports', name: 'Sports' },
  { id: 'books', name: 'Livres' },
  { id: 'toys', name: 'Jouets' },
  { id: 'auto', name: 'Auto' },
  { id: 'garden', name: 'Jardin' },
  { id: 'food', name: 'Alimentation' },
];

export const offers = [
  { id: 'promo1', title: 'Offre Spéciale Téléphone', description: 'Réduction de 20% sur les téléphones XYZ', image: '/images/smartphone.jpg' },
  { id: 'promo2', title: 'Promo Ordinateur', description: 'Jusqu\'à 30% de réduction sur les ordinateurs portables', image: '/images/laptop.jpg' },
  { id: 'promo3', title: 'Soldes Casques', description: '15% de remise sur tous les casques audio', image: '/images/casque.jpg' },
  { id: 'promo4', title: 'Offre Flash Montres', description: 'Profitez de 25% de réduction sur les montres connectées', image: '/images/montre.jpg' },
  { id: 'promo5', title: 'Bon Plan Tablettes', description: 'Économisez 100 000 Ar sur les tablettes Pro', image: '/images/tablet.png' },
  { id: 'promo6', title: 'Promo Son', description: '2 enceintes Bluetooth achetées = 1 offerte', image: '/images/speaker.png' },
];

export const brands = [
  'TechCo',
  'CompuTech',
  'AudioPro',
  'TimeMaster',
  'SoundWave',
  'PhotoPro',
  'GameMaster',
  'SkyView',
];