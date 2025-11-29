export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  role: 'admin' | 'attendee' | 'agency';
}

export enum RoutePaths {
  HOME = '/',
  LOGIN = '/login',
  AGENCY_LANDING = '/agency',
  TERMS = '/terms',
  PRIVACY = '/privacy',
  APP_GALLERY = '/app/gallery',
  ADMIN_DASHBOARD = '/admin/dashboard',
  // Placeholders
  PRICING = '/pricing',
  FEATURES = '/features',
  SELFIE = '/selfie'
}

export interface NavItem {
  label: string;
  path: string;
  icon?: string;
}