export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'attendee' | 'agency';
}

export const RoutePaths = {
  HOME: '/',
  LOGIN: '/login',
  AGENCY_LANDING: '/agency',
  TERMS: '/terms',
  PRIVACY: '/privacy',
  PRICING: '/pricing',
  FEATURES: '/features',
  
  // App / Attendee
  APP_GALLERY: '/gallery/:eventId',
  
  // Admin / Agency
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_EVENTS: '/admin/events',
  ADMIN_EVENT_DETAIL: '/admin/events/:eventId',
  ADMIN_SETTINGS: '/admin/settings',
  
  // Legacy/Redirects
  SELFIE: '/selfie'
} as const;

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}

export interface Photo {
  id: string;
  originalUrl: string;
  watermarkedUrl: string; // Heavy watermark for display
  thumbnailUrl?: string;
  eventId: string;
  embedding?: number[]; // For face search
  price?: number;
}

export interface CartItem {
  photoId: string;
  thumbnailUrl: string;
  type: 'digital' | 'print' | 'remix';
  price: number;
  quantity: number;
}

export interface EventPricing {
  creditPrice: number;
  socialPrice: number;
  printPrice: number;
}

export interface Event {
  id: string;
  name: string;
  date: string;
  slug: string;
  coverImage?: string;
  agencyId: string;
  status: 'active' | 'archived' | 'draft';
  photoCount: number;
}