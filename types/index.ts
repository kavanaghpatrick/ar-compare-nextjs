// Product types for AR Compare application

// Raw product data as it exists in the data file before transformation
export interface RawProductData {
  id: string;
  brand: string;
  model: string;
  fullName: string;
  price: number;
  originalPrice: number;
  currency: string;
  availability: string;
  image: string;
  category: string;
  releaseDate: string;
  description: string;
  keyFeatures: string[];
  specifications: ExtendedProductSpecifications;
  rating: number;
  pros: string[];
  cons: string[];
  companyInfo: CompanyInfo;
}
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

// Type for additional specification categories that may exist in the data
export interface ExtendedProductSpecifications extends ProductSpecifications {
  [key: string]: DisplaySpecs | DesignSpecs | AudioSpecs | ConnectivitySpecs | FeatureSpecs | string | undefined;
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
  specifications: ExtendedProductSpecifications;
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

// API Response types
export interface ApiSuccessResponse<T = unknown> {
  success: true;
  data: T;
}

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// API Response type definitions
export interface ProductsApiResponse {
  products: Product[];
  total: number;
  count: number;
  filters: {
    category: string | null;
    brand: string | null;
    minPrice: string | null;
    maxPrice: string | null;
    sortBy: string;
    sortOrder: string;
  };
}

// Enhanced Product interfaces for research-based data
export interface AmazonData {
  price: string;
  availability: string;
  rating?: string;
  reviewCount?: string;
  shipping: string;
  asin?: string;
}

export interface CustomerInsights {
  topPros: string[];
  topCons: string[];
  overallSentiment: string;
}

export interface MarketContext {
  targetAudience: string;
  useCases: string[];
  competitiveAdvantage: string;
  pricePositioning: string;
}

export interface PurchaseRecommendation {
  bestFor: string[];
  avoidIf: string[];
  alternativeConsider: string;
}

// Type for enhanced specifications with specific known properties
export interface EnhancedSpecs {
  displayTechnology?: string;
  perceivedBrightness?: string;
  audioPartnership?: string;
  audioSystem?: string;
  trackingCapability?: string;
  batteryLife?: string;
  prescriptionSupport?: string;
  electrochromicDimming?: string;
  spatialComputing?: string;
  aiIntegration?: string;
  processingPower?: string;
  audioArray?: string;
  connectivityOptions?: string;
  adaptiveDimming?: string;
  realTime2Dto3D?: string;
  myopiaSupport?: string;
  electrochromicFilm?: string;
  ipdAdjustment?: string;
  universalCompatibility?: string;
  contrastRatio?: string;
  audioUpgrade?: string;
  eyeCaretech?: string;
  imaxEnhanced?: string;
  adaptiveBrightness?: string;
  weightOptimization?: string;
  aiCapabilities?: string;
  spatialAccuracy?: string;
  frameMaterial?: string;
  operatingSystem?: string;
  controlMethods?: string;
  frameMaterials?: string;
  prescriptionIntegration?: string;
  connectivity?: string;
  aiFeatures?: string;
  subscriptionService?: string;
  processingHardware?: string;
  openSourceNature?: string;
  cameraCapability?: string;
  connectivityProtocol?: string;
  creditSystem?: string;
  [key: string]: string | undefined;
}

export interface EnhancedProduct extends Product {
  amazon: AmazonData;
  enhancedSpecs: EnhancedSpecs;
  customerInsights: CustomerInsights;
  marketContext: MarketContext;
  purchaseRecommendation: PurchaseRecommendation;
}