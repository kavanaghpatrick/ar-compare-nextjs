// Product types for AR Compare application
export interface DisplaySpecs {
  type: string;
  resolution: string;
  refreshRate: string;
  brightness: string;
  fov: string;
  colorAccuracy?: string;
}

export interface DesignSpecs {
  weight: string;
  material: string;
  ipdAdjustment: string;
  dimming?: string;
}

export interface AudioSpecs {
  speakers: string;
  microphones: string;
  soundLeakage?: string;
}

export interface ConnectivitySpecs {
  connection: string;
  compatibility: string[];
}

export interface FeatureSpecs {
  tracking?: string;
  chip?: string;
  latency?: string;
  camera?: string;
}

export interface ProductSpecifications {
  display: DisplaySpecs;
  design: DesignSpecs;
  audio: AudioSpecs;
  connectivity: ConnectivitySpecs;
  features?: FeatureSpecs;
  reviews?: string;
}

export interface CompanyInfo {
  founded: string;
  headquarters: string;
  employees: string;
  marketShare: string;
  description: string;
}

export interface Product {
  id: string;
  brand: string;
  model: string;
  fullName: string;
  shortName?: string; // Make optional for backwards compatibility
  name: string; // Add name field for component compatibility
  price: number;
  originalPrice: number;
  currency: string;
  availability: string;
  image: string;
  imageUrl: string; // Add for backward compatibility
  category: string;
  releaseDate: string;
  description: string;
  keyFeatures: string[];
  features: string[]; // Add for backward compatibility
  specifications: ProductSpecifications & { [key: string]: any }; // Add index signature
  rating: number;
  pros: string[];
  cons: string[];
  companyInfo: CompanyInfo;
}

export interface ComparisonItem {
  productId: string;
  position: number;
}

export interface ComparisonState {
  items: ComparisonItem[];
  maxItems: number;
}

export type SortOption = 'price' | 'rating' | 'brand' | 'fov' | 'weight';
export type SortOrder = 'asc' | 'desc';
export type ViewType = 'main' | 'comparison' | 'details';
export type ComparisonViewType = 'grid' | 'table';
export type TabType = 'specs' | 'features' | 'pros-cons' | 'company';