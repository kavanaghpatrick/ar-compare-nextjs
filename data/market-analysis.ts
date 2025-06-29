import { Product } from '@/types';
import { arGlassesData } from './products';

// Market Analysis Types
export interface ProductRanking {
  productId: string;
  score: number;
  justification: string;
}

export interface ProductRecommendation {
  primary: string;
  alternatives: string[];
  reasoning: string;
  bestFor: string[];
  considerations: string[];
}

export interface MarketSegment {
  name: string;
  priceRange: { min: number; max: number };
  products: string[];
  targetAudience: string[];
  keyFeatures: string[];
}

export interface UseCaseAnalysis {
  useCase: string;
  primaryRecommendation: ProductRecommendation;
  requirements: string[];
  dealBreakers: string[];
}

export interface CompetitiveMatrix {
  displayQuality: ProductRanking[];
  valueForMoney: ProductRanking[];
  buildQuality: ProductRanking[];
  softwareEcosystem: ProductRanking[];
  innovation: ProductRanking[];
  userExperience: ProductRanking[];
}

export interface MarketTrends {
  category: string;
  trend: string;
  impact: 'high' | 'medium' | 'low';
  description: string;
  affectedProducts: string[];
}

export interface BuyerPersona {
  name: string;
  description: string;
  primaryNeeds: string[];
  budget: { min: number; max: number };
  technicalExpertise: 'beginner' | 'intermediate' | 'advanced';
  primaryRecommendations: string[];
  considerations: string[];
}

export interface MarketAnalysis {
  competitiveMatrix: CompetitiveMatrix;
  marketSegments: MarketSegment[];
  useCaseRecommendations: { [key: string]: UseCaseAnalysis };
  marketTrends: MarketTrends[];
  buyerPersonas: BuyerPersona[];
  marketInsights: {
    topPerformers: {
      overall: string;
      valueLeader: string;
      innovationLeader: string;
      qualityLeader: string;
    };
    marketGaps: string[];
    emergingOpportunities: string[];
    competitiveLandscape: string;
  };
}

// Competitive Matrix Analysis
const competitiveMatrix: CompetitiveMatrix = {
  displayQuality: [
    {
      productId: 'viture-pro-xr',
      score: 95,
      justification: 'Exceptional 4000 nits brightness, Sony Micro-OLED, 120Hz refresh rate, and 100% sRGB color accuracy'
    },
    {
      productId: 'xreal-one-pro',
      score: 92,
      justification: 'Premium Sony 0.55" Micro-OLED, excellent 57° FOV, 120Hz, 700 nits, industry-leading field of view'
    },
    {
      productId: 'rokid-ar-spatial',
      score: 88,
      justification: 'High-quality Micro-OLED with 1000 nits brightness, good color reproduction, 90Hz refresh'
    },
    {
      productId: 'rayneo-x3-pro',
      score: 82,
      justification: 'Solid Micro-OLED display with 800 nits, 90Hz, good color accuracy for professional use'
    },
    {
      productId: 'xreal-one',
      score: 78,
      justification: 'Quality Micro-OLED with 600 nits, 90Hz, good color accuracy, smaller 50° FOV'
    },
    {
      productId: 'even-realities-g1',
      score: 65,
      justification: 'Micro-LED technology but limited to monochrome green, 1000 nits, very small 25° FOV'
    },
    {
      productId: 'brilliant-labs-frame',
      score: 60,
      justification: 'Color OLED but lower resolution (640×400), small 20° FOV, adequate for development'
    },
    {
      productId: 'rayneo-air-3s',
      score: 55,
      justification: 'Basic LCD technology, 400 nits brightness, 60Hz refresh rate, entry-level quality'
    }
  ],
  valueForMoney: [
    {
      productId: 'xreal-one',
      score: 95,
      justification: 'Excellent balance of features and price at $499, Micro-OLED display, good compatibility'
    },
    {
      productId: 'rayneo-air-3s',
      score: 92,
      justification: 'Outstanding value at $269 for entry-level AR experience, lightweight, multi-device support'
    },
    {
      productId: 'brilliant-labs-frame',
      score: 85,
      justification: 'Unique open-source platform at $349, great for developers, AI integration, very lightweight'
    },
    {
      productId: 'viture-pro-xr',
      score: 82,
      justification: 'Premium features at $449, exceptional display quality, 2D-to-3D conversion, wide compatibility'
    },
    {
      productId: 'rokid-ar-spatial',
      score: 75,
      justification: 'Advanced AI features at $598, good spatial computing, but higher price point'
    },
    {
      productId: 'xreal-one-pro',
      score: 72,
      justification: 'Premium quality justified at $599, best-in-class FOV, Bose audio, but expensive'
    },
    {
      productId: 'even-realities-g1',
      score: 65,
      justification: 'High price at $599 for limited features, everyday wearability premium'
    },
    {
      productId: 'rayneo-x3-pro',
      score: 60,
      justification: 'Expensive at $899 for niche professional features, limited ecosystem'
    }
  ],
  buildQuality: [
    {
      productId: 'xreal-one-pro',
      score: 95,
      justification: 'Premium titanium frame construction, Bose audio integration, precision engineering'
    },
    {
      productId: 'even-realities-g1',
      score: 90,
      justification: 'Luxury eyewear-grade construction, premium materials, custom fitting options'
    },
    {
      productId: 'viture-pro-xr',
      score: 88,
      justification: 'High-quality aluminum alloy construction, electrochromic dimming, Harman audio'
    },
    {
      productId: 'rayneo-x3-pro',
      score: 85,
      justification: 'Professional-grade aluminum frame, advanced sensor integration, robust design'
    },
    {
      productId: 'rokid-ar-spatial',
      score: 82,
      justification: 'Solid premium plastic construction, good durability, adaptive dimming system'
    },
    {
      productId: 'xreal-one',
      score: 78,
      justification: 'Quality aluminum frame, good build standards, lightweight design'
    },
    {
      productId: 'brilliant-labs-frame',
      score: 70,
      justification: 'Lightweight construction prioritizes portability, adequate for target use case'
    },
    {
      productId: 'rayneo-air-3s',
      score: 65,
      justification: 'Basic plastic construction appropriate for price point, comfortable but not premium'
    }
  ],
  softwareEcosystem: [
    {
      productId: 'xreal-one-pro',
      score: 92,
      justification: 'Mature ecosystem with Google partnership, wide device compatibility, regular updates'
    },
    {
      productId: 'xreal-one',
      score: 90,
      justification: 'Same mature ecosystem as Pro model, excellent compatibility across platforms'
    },
    {
      productId: 'rokid-ar-spatial',
      score: 85,
      justification: 'Advanced proprietary LLM integration, scene recognition, spatial computing features'
    },
    {
      productId: 'viture-pro-xr',
      score: 80,
      justification: 'AI-powered workspace features, 2D-to-3D conversion, good compatibility'
    },
    {
      productId: 'brilliant-labs-frame',
      score: 78,
      justification: 'Open-source platform strength, Perplexity AI integration, developer community'
    },
    {
      productId: 'rayneo-x3-pro',
      score: 72,
      justification: 'Professional features like SLAM navigation, translation, but limited app ecosystem'
    },
    {
      productId: 'even-realities-g1',
      score: 70,
      justification: 'Even AI integration, good everyday features, but limited third-party apps'
    },
    {
      productId: 'rayneo-air-3s',
      score: 60,
      justification: 'Basic software features, limited ecosystem, essential functionality only'
    }
  ],
  innovation: [
    {
      productId: 'xreal-one-pro',
      score: 95,
      justification: 'Self-developed X1 chip, industry-leading 57° FOV, advanced spatial computing'
    },
    {
      productId: 'rokid-ar-spatial',
      score: 92,
      justification: 'Proprietary LLM integration, advanced scene recognition, spatial computing pioneer'
    },
    {
      productId: 'viture-pro-xr',
      score: 88,
      justification: 'Real-time 2D-to-3D conversion, AI-powered multiscreen workspace, electrochromic dimming'
    },
    {
      productId: 'brilliant-labs-frame',
      score: 85,
      justification: 'Open-source platform innovation, developer-first approach, AI integration'
    },
    {
      productId: 'even-realities-g1',
      score: 80,
      justification: 'Everyday wearability focus, micro-LED display technology, luxury design approach'
    },
    {
      productId: 'rayneo-x3-pro',
      score: 75,
      justification: 'Advanced gesture control, SLAM navigation, multi-language translation'
    },
    {
      productId: 'xreal-one',
      score: 70,
      justification: 'Solid engineering but incremental improvements over previous generation'
    },
    {
      productId: 'rayneo-air-3s',
      score: 55,
      justification: 'Basic feature set, minimal innovation, entry-level positioning'
    }
  ],
  userExperience: [
    {
      productId: 'xreal-one',
      score: 92,
      justification: 'Excellent balance of ease of use, compatibility, and performance, minimal learning curve'
    },
    {
      productId: 'xreal-one-pro',
      score: 90,
      justification: 'Premium experience with superior audio and display, intuitive operation'
    },
    {
      productId: 'viture-pro-xr',
      score: 88,
      justification: 'Great multimedia experience, excellent brightness adaptation, smooth operation'
    },
    {
      productId: 'even-realities-g1',
      score: 85,
      justification: 'Seamless everyday integration, excellent AI assistance, natural interaction'
    },
    {
      productId: 'rayneo-air-3s',
      score: 80,
      justification: 'Simple, straightforward experience appropriate for entry-level users'
    },
    {
      productId: 'rokid-ar-spatial',
      score: 75,
      justification: 'Powerful features but requires learning curve, complex setup process'
    },
    {
      productId: 'rayneo-x3-pro',
      score: 70,
      justification: 'Professional features create complexity, steep learning curve required'
    },
    {
      productId: 'brilliant-labs-frame',
      score: 65,
      justification: 'Developer-focused experience, requires technical knowledge, limited consumer polish'
    }
  ]
};

// Market Segments
const marketSegments: MarketSegment[] = [
  {
    name: 'Budget Entry-Level',
    priceRange: { min: 200, max: 350 },
    products: ['rayneo-air-3s', 'brilliant-labs-frame'],
    targetAudience: ['First-time AR users', 'Students', 'Hobbyists', 'Developers on budget'],
    keyFeatures: ['Basic AR functionality', 'Lightweight design', 'Multi-device compatibility', 'Affordable pricing']
  },
  {
    name: 'Mid-Range Consumer',
    priceRange: { min: 400, max: 550 },
    products: ['xreal-one', 'viture-pro-xr'],
    targetAudience: ['Tech enthusiasts', 'Gamers', 'Content consumers', 'Professionals'],
    keyFeatures: ['Quality display', 'Good audio', 'Wide compatibility', 'Balanced features']
  },
  {
    name: 'Premium Professional',
    priceRange: { min: 550, max: 700 },
    products: ['xreal-one-pro', 'rokid-ar-spatial', 'even-realities-g1'],
    targetAudience: ['Early adopters', 'Professionals', 'Content creators', 'Enterprise users'],
    keyFeatures: ['Premium materials', 'Advanced features', 'Superior audio', 'Professional software']
  },
  {
    name: 'Enterprise/Developer',
    priceRange: { min: 800, max: 1200 },
    products: ['rayneo-x3-pro'],
    targetAudience: ['Enterprise developers', 'AR professionals', 'Industrial users', 'Research institutions'],
    keyFeatures: ['Advanced tracking', 'Professional software', 'Enterprise features', 'Development tools']
  }
];

// Use Case Analysis
const useCaseRecommendations: { [key: string]: UseCaseAnalysis } = {
  gaming: {
    useCase: 'Gaming and Entertainment',
    primaryRecommendation: {
      primary: 'xreal-one-pro',
      alternatives: ['xreal-one', 'viture-pro-xr'],
      reasoning: 'Superior field of view (57°), low latency (3ms), premium audio by Bose, and excellent display quality provide the best gaming experience',
      bestFor: ['Immersive gaming', 'Steam Deck gaming', 'Console gaming', 'High-action games'],
      considerations: ['Higher price point', 'Requires compatible gaming device', 'May need adjustment period for FOV']
    },
    requirements: ['Low latency', 'Wide field of view', 'High refresh rate', 'Good audio', 'Stable connection'],
    dealBreakers: ['High latency >20ms', 'Poor audio quality', 'Connection instability', 'Limited FOV <40°']
  },
  productivity: {
    useCase: 'Productivity and Work',
    primaryRecommendation: {
      primary: 'viture-pro-xr',
      alternatives: ['xreal-one', 'rokid-ar-spatial'],
      reasoning: 'AI-powered multiscreen workspace, excellent brightness (4000 nits) for various lighting conditions, and 2D-to-3D conversion enhance productivity workflows',
      bestFor: ['Multi-monitor setup replacement', 'Remote work', 'Content creation', 'Data analysis'],
      considerations: ['Learning curve for workspace features', 'Power consumption', 'Eye strain with extended use']
    },
    requirements: ['High brightness', 'Multi-screen support', 'Good text clarity', 'Extended comfort', 'Wide compatibility'],
    dealBreakers: ['Poor text rendering', 'Uncomfortable for long sessions', 'Limited screen real estate', 'Incompatible with work devices']
  },
  entertainment: {
    useCase: 'Media Consumption',
    primaryRecommendation: {
      primary: 'viture-pro-xr',
      alternatives: ['xreal-one', 'xreal-one-pro'],
      reasoning: 'Exceptional brightness (4000 nits), real-time 2D-to-3D conversion, premium audio, and wide device compatibility make it ideal for movies and streaming',
      bestFor: ['Movie watching', 'Streaming content', 'Travel entertainment', 'Private viewing'],
      considerations: ['Battery life of source device', 'Comfort for long sessions', 'Audio setup requirements']
    },
    requirements: ['Excellent display quality', 'Good audio', 'Wide device compatibility', 'Comfortable fit', 'Long session comfort'],
    dealBreakers: ['Poor display quality', 'Bad audio', 'Heavy weight', 'Limited device support', 'Eye strain']
  },
  development: {
    useCase: 'AR Development and Research',
    primaryRecommendation: {
      primary: 'brilliant-labs-frame',
      alternatives: ['rokid-ar-spatial', 'rayneo-x3-pro'],
      reasoning: 'Open-source platform, developer-friendly tools, AI integration, lightweight design, and active community support make it ideal for development work',
      bestFor: ['AR app development', 'AI experimentation', 'Open-source projects', 'Educational use'],
      considerations: ['Requires technical expertise', 'Limited consumer polish', 'Smaller display', 'No built-in speakers']
    },
    requirements: ['Open platform', 'Development tools', 'SDK access', 'Community support', 'Affordable pricing'],
    dealBreakers: ['Closed ecosystem', 'No development access', 'High cost', 'Limited documentation', 'Poor SDK']
  },
  everyday: {
    useCase: 'Everyday Smart Glasses',
    primaryRecommendation: {
      primary: 'even-realities-g1',
      alternatives: ['brilliant-labs-frame', 'xreal-one'],
      reasoning: 'Designed for everyday wear with luxury eyewear aesthetics, practical AI features, navigation, and prescription support make it ideal for daily use',
      bestFor: ['Daily wear', 'Navigation assistance', 'Smart notifications', 'Lifestyle integration'],
      considerations: ['Monochrome display limitation', 'No built-in speakers', 'Higher price for limited features']
    },
    requirements: ['Comfortable for all-day wear', 'Practical features', 'Good battery life', 'Discrete design', 'Easy to use'],
    dealBreakers: ['Bulky design', 'Poor battery life', 'Complicated interface', 'Obvious tech appearance', 'Frequent charging']
  },
  budget: {
    useCase: 'Budget-Conscious Entry',
    primaryRecommendation: {
      primary: 'rayneo-air-3s',
      alternatives: ['brilliant-labs-frame', 'xreal-one'],
      reasoning: 'Lowest price point at $269, decent basic functionality, lightweight design, and multi-device support provide good entry-level AR experience',
      bestFor: ['First AR experience', 'Basic media consumption', 'Casual use', 'Testing AR viability'],
      considerations: ['Limited features', 'Basic build quality', 'Higher latency', 'Smaller ecosystem']
    },
    requirements: ['Affordable price', 'Basic functionality', 'Easy setup', 'Decent quality', 'Good value'],
    dealBreakers: ['Unusable quality', 'No device compatibility', 'Extremely poor build', 'No support', 'Hidden costs']
  }
};

// Market Trends
const marketTrends: MarketTrends[] = [
  {
    category: 'Display Technology',
    trend: 'Micro-OLED Adoption',
    impact: 'high',
    description: 'Shift from LCD to Micro-OLED displays for better quality, power efficiency, and form factor',
    affectedProducts: ['xreal-one-pro', 'xreal-one', 'rokid-ar-spatial', 'rayneo-x3-pro', 'viture-pro-xr']
  },
  {
    category: 'AI Integration',
    trend: 'Built-in AI Assistants',
    impact: 'high',
    description: 'Integration of LLMs and AI capabilities directly into AR glasses for enhanced user experience',
    affectedProducts: ['rokid-ar-spatial', 'even-realities-g1', 'brilliant-labs-frame', 'viture-pro-xr']
  },
  {
    category: 'Field of View',
    trend: 'Expanding FOV',
    impact: 'high',
    description: 'Race to achieve larger fields of view, with 50°+ becoming the new standard for premium devices',
    affectedProducts: ['xreal-one-pro', 'xreal-one', 'viture-pro-xr']
  },
  {
    category: 'Form Factor',
    trend: 'Everyday Wearability',
    impact: 'medium',
    description: 'Focus on making AR glasses indistinguishable from regular eyewear for mainstream adoption',
    affectedProducts: ['even-realities-g1', 'brilliant-labs-frame']
  },
  {
    category: 'Tracking Technology',
    trend: '6DOF and SLAM',
    impact: 'medium',
    description: 'Advanced tracking capabilities becoming standard for spatial computing applications',
    affectedProducts: ['rokid-ar-spatial', 'rayneo-x3-pro']
  },
  {
    category: 'Open Source',
    trend: 'Developer-First Platforms',
    impact: 'medium',
    description: 'Growing interest in open-source AR platforms for development and customization',
    affectedProducts: ['brilliant-labs-frame']
  },
  {
    category: 'Audio Innovation',
    trend: 'Premium Audio Integration',
    impact: 'medium',
    description: 'Partnership with audio brands for superior sound quality in AR experiences',
    affectedProducts: ['xreal-one-pro', 'viture-pro-xr']
  },
  {
    category: 'Pricing Strategy',
    trend: 'Market Segmentation',
    impact: 'high',
    description: 'Clear differentiation between budget, mid-range, and premium segments with distinct feature sets',
    affectedProducts: ['rayneo-air-3s', 'xreal-one', 'xreal-one-pro', 'rayneo-x3-pro']
  }
];

// Buyer Personas
const buyerPersonas: BuyerPersona[] = [
  {
    name: 'Gaming Enthusiast',
    description: 'Passionate gamer looking for immersive AR gaming experiences with low latency and high quality',
    primaryNeeds: ['Low latency', 'Wide FOV', 'Good audio', 'Gaming compatibility', 'Immersive experience'],
    budget: { min: 400, max: 700 },
    technicalExpertise: 'intermediate',
    primaryRecommendations: ['xreal-one-pro', 'xreal-one', 'viture-pro-xr'],
    considerations: ['Device compatibility', 'Setup complexity', 'Learning curve', 'Additional accessories needed']
  },
  {
    name: 'Remote Professional',
    description: 'Remote worker seeking productivity enhancement with virtual workspace and multi-monitor capabilities',
    primaryNeeds: ['Multi-screen support', 'Text clarity', 'Long session comfort', 'Professional appearance', 'Work device compatibility'],
    budget: { min: 450, max: 650 },
    technicalExpertise: 'intermediate',
    primaryRecommendations: ['viture-pro-xr', 'xreal-one', 'rokid-ar-spatial'],
    considerations: ['Eye strain', 'Professional appearance', 'IT policy compliance', 'Productivity learning curve']
  },
  {
    name: 'Tech Early Adopter',
    description: 'Technology enthusiast wanting cutting-edge features and willing to pay premium for innovation',
    primaryNeeds: ['Latest technology', 'Premium features', 'Innovation', 'Build quality', 'Ecosystem maturity'],
    budget: { min: 550, max: 900 },
    technicalExpertise: 'advanced',
    primaryRecommendations: ['xreal-one-pro', 'rokid-ar-spatial', 'rayneo-x3-pro'],
    considerations: ['Feature complexity', 'Ecosystem maturity', 'Update frequency', 'Community support']
  },
  {
    name: 'Budget-Conscious Student',
    description: 'Student or young professional seeking affordable entry into AR technology',
    primaryNeeds: ['Affordable price', 'Basic functionality', 'Durability', 'Learning resources', 'Future upgrade path'],
    budget: { min: 200, max: 400 },
    technicalExpertise: 'beginner',
    primaryRecommendations: ['rayneo-air-3s', 'brilliant-labs-frame', 'xreal-one'],
    considerations: ['Total cost of ownership', 'Learning resources', 'Upgrade timeline', 'Feature limitations']
  },
  {
    name: 'Developer/Maker',
    description: 'Software developer or maker interested in AR development and customization capabilities',
    primaryNeeds: ['Open platform', 'Development tools', 'Community support', 'SDK access', 'Hackability'],
    budget: { min: 300, max: 600 },
    technicalExpertise: 'advanced',
    primaryRecommendations: ['brilliant-labs-frame', 'rokid-ar-spatial', 'rayneo-x3-pro'],
    considerations: ['Platform openness', 'Documentation quality', 'Community size', 'Development roadmap']
  },
  {
    name: 'Everyday Consumer',
    description: 'Mainstream consumer looking for practical smart glasses for daily activities',
    primaryNeeds: ['Everyday wearability', 'Practical features', 'Easy to use', 'Good battery life', 'Stylish design'],
    budget: { min: 400, max: 600 },
    technicalExpertise: 'beginner',
    primaryRecommendations: ['even-realities-g1', 'xreal-one', 'viture-pro-xr'],
    considerations: ['Social acceptance', 'Battery life', 'Setup complexity', 'Privacy concerns']
  }
];

// Market Insights
const marketInsights = {
  topPerformers: {
    overall: 'xreal-one-pro',
    valueLeader: 'xreal-one',
    innovationLeader: 'rokid-ar-spatial',
    qualityLeader: 'viture-pro-xr'
  },
  marketGaps: [
    'Truly affordable (sub-$200) AR glasses with decent quality',
    'Enterprise-grade AR glasses with advanced security features',
    'AR glasses with built-in prescription lens integration',
    'Ultra-lightweight (<50g) AR glasses with full features',
    'AR glasses with all-day battery life (8+ hours)',
    'Medical/healthcare-specific AR applications',
    'AR glasses optimized for outdoor use with high brightness'
  ],
  emergingOpportunities: [
    'AI-first AR experiences with advanced computer vision',
    'Social AR experiences and multiplayer applications',
    'AR glasses as primary computing device (phone replacement)',
    'Specialized AR glasses for specific industries (healthcare, manufacturing)',
    'AR glasses with advanced biometric monitoring',
    'Integration with smart home and IoT ecosystems',
    'AR glasses for accessibility and assistive technology'
  ],
  competitiveLandscape: 'The AR glasses market is rapidly evolving with clear segmentation emerging. Xreal dominates with mature ecosystem and Google partnership, while newer players like Rokid focus on AI innovation. The market shows healthy competition across price points, from budget options like RayNeo Air 3s to premium offerings like Xreal One Pro. Key differentiators include display technology (Micro-OLED adoption), field of view expansion, AI integration, and form factor innovation. The industry is moving toward mainstream adoption with increasing focus on everyday wearability and practical applications.'
};

// Complete Market Analysis
export const marketAnalysis: MarketAnalysis = {
  competitiveMatrix,
  marketSegments,
  useCaseRecommendations,
  marketTrends,
  buyerPersonas,
  marketInsights
};

export default marketAnalysis;