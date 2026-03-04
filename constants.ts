
import { Product } from './types.ts';

export const PRODUCTS: Product[] = [
  // T-shirts (Existing/Refined)
  {
    id: 't1',
    name: 'Cyber-Void Graphic',
    price: 1899,
    originalPrice: 2499,
    discount: '24% OFF',
    category: 'Graphic T-shirts',
    images: ['https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?q=80&w=600&auto=format&fit=crop'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Jet Black'],
    fitType: 'Oversized',
    fabric: '240 GSM Cotton',
    availability: true,
    description: 'A digital artifact for your wardrobe. Unlocks "Void Glitch" AR signature.',
    rating: 5.0,
    reviews: 12,
    arEffect: { id: 'eff-1', name: 'Void Glitch', type: 'glitch', color: '#a855f7' }
  },
  // Hoodies
  {
    id: 'h1',
    name: 'Stealth Tech Hoodie',
    price: 3499,
    originalPrice: 4500,
    discount: '22% OFF',
    category: 'Hoodies',
    images: ['https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Carbon Black'],
    fitType: 'Boxy Heavyweight',
    fabric: '450 GSM Fleece',
    availability: true,
    description: 'The ultimate urban shield. Heavyweight fleece with hidden AR code.',
    rating: 4.9,
    reviews: 45,
    arEffect: { id: 'eff-4', name: 'Thermal Pulse', type: 'pulse', color: '#ef4444' }
  },
  // Caps
  {
    id: 'c1',
    name: 'Nebula Strapback',
    price: 999,
    originalPrice: 1299,
    discount: '23% OFF',
    category: 'Caps',
    images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?q=80&w=600&auto=format&fit=crop'],
    colors: ['Acid Wash Blue'],
    availability: true,
    description: 'Distressed vintage silhouette with 3D embroidery.',
    rating: 4.8,
    reviews: 28
  },
  // Paintings
  {
    id: 'p1',
    name: 'Digital Solitude #04',
    price: 8500,
    originalPrice: 12000,
    discount: 'Limited Edition',
    category: 'Paintings',
    images: ['https://images.unsplash.com/photo-1541963463532-d68292c34b19?q=80&w=600&auto=format&fit=crop'],
    availability: true,
    description: 'Hand-painted oil on canvas. Abstract exploration of digital isolation.',
    rating: 5.0,
    reviews: 4
  },
  // Wall Frames
  {
    id: 'f1',
    name: 'Minimalist Grid Frame',
    price: 2499,
    originalPrice: 2499,
    discount: '',
    category: 'Wall Frames',
    images: ['https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?q=80&w=600&auto=format&fit=crop'],
    availability: true,
    description: 'Industrial matte black aluminium frame with museum-grade acrylic.',
    rating: 4.7,
    reviews: 19
  },
  // Terrariums
  {
    id: 'ter1',
    name: 'Bio-Sphere Zenith',
    price: 4500,
    originalPrice: 5500,
    discount: 'New Arrival',
    category: 'Terrarium',
    images: ['https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop'],
    availability: true,
    description: 'Self-sustaining ecosystem in a hand-blown glass sphere.',
    rating: 4.9,
    reviews: 31
  }
];

export const CATEGORIES: string[] = ['All', 'T-shirts', 'Caps', 'Hoodies', 'Paintings', 'Wall Frames', 'Terrarium'];
export const SORT_OPTIONS = [
  { label: 'New Arrivals', value: 'new' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
];