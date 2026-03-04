
export type Category = 'T-shirts' | 'Graphic T-shirts' | 'Plain T-shirts' | 'Caps' | 'Hoodies' | 'Paintings' | 'Wall Frames' | 'Terrarium';

export interface AREffect {
  id: string;
  name: string;
  type: 'pulse' | 'glitch' | 'aura' | 'particles';
  color: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  discount: string;
  category: Category;
  images: string[];
  sizes?: string[];
  colors?: string[];
  fitType?: string;
  fabric?: string;
  availability: boolean;
  description: string;
  washCare?: string;
  rating: number;
  reviews: number;
  arEffect?: AREffect;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface BillingDetails {
  fullName: string;
  email: string;
  address: string;
  city: string;
  zip: string;
  phone: string;
  paymentMethod: 'card' | 'upi' | 'crypto';
}

export interface ARState {
  isActive: boolean;
  isScanning: boolean;
  unlockedEffectId: string | null;
  activeProductId: string | null;
}

// Fix for: Module '"../types.ts"' has no exported member 'Message'.
export interface Message {
  role: 'user' | 'model';
  content: string;
}