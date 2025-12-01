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
  // New slug-based route: domain.com/agency-name/event-name
  EVENT_SLUG: '/:agencySlug/:eventSlug',
  APP_GALLERY: '/gallery/:eventId', // Fallback ID based route
  CHECKOUT_SUCCESS: '/checkout/success',
  
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

export type ProductType = 'social' | 'print' | 'original' | 'remix';

export interface CartItem {
  id: string; // Unique cart item ID
  photoId: string;
  thumbnailUrl: string;
  type: ProductType;
  price: number;
  label: string; // e.g., "Social Download"
}

export interface EventPricing {
  creditPrice: number;
  socialPrice: number;
  printPrice: number;
  originalPrice: number;
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
  pricing?: EventPricing;
}