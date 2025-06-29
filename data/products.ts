import { Product } from '@/types';

// Helper function to transform the data
function transformProduct(product: any): Product {
  return {
    ...product,
    name: product.fullName,
    imageUrl: product.image,
    features: product.keyFeatures,
  };
}

const rawArGlassesData = [
  // Xreal Products
  {
    id: 'xreal-one-pro',
    brand: 'Xreal',
    model: 'One Pro',
    fullName: 'Xreal One Pro',
    price: 599,
    originalPrice: 649,
    currency: 'USD',
    availability: 'Pre-order',
    image: '/api/placeholder/400/300',
    category: 'Premium',
    releaseDate: '2025',
    description: "World's first AR glasses with self-developed spatial computing chip",
    keyFeatures: [
      'XREAL X1 Chip',
      '57° Field of View',
      'Sound by Bose',
      'Native 3 DoF tracking',
      'Ultrawide Mode (310" screen)'
    ],
    specifications: {
      display: {
        type: 'Sony 0.55" Micro-OLED',
        resolution: '1920×1080 per eye',
        refreshRate: '120Hz',
        brightness: '700 nits',
        fov: '57°',
        colorAccuracy: 'ΔE <3'
      },
      design: {
        weight: '87g',
        material: 'Titanium frame',
        ipdAdjustment: 'Optional (57-75mm)',
        dimming: '3-level electrochromic'
      },
      audio: {
        speakers: 'Sound by Bose',
        microphones: '2 built-in',
        soundLeakage: 'Reduced'
      },
      connectivity: {
        connection: 'USB-C DisplayPort Alt mode',
        compatibility: ['iPhone', 'Android', 'MacBook', 'Steam Deck', 'Windows PC']
      },
      features: {
        tracking: '3 DoF',
        chip: 'XREAL X1',
        latency: '3ms M2P',
        camera: 'XREAL Eye'
      }
    },
    rating: 4.6,
    pros: [
      'Industry-leading field of view',
      'Premium Bose audio',
      'Self-developed X1 chip',
      'Titanium build quality',
      'Low latency performance'
    ],
    cons: [
      'Higher price point',
      'Pre-order only',
      'Requires compatible device',
      'Limited to 3 DoF tracking'
    ],
    companyInfo: {
      founded: '2017',
      headquarters: 'Beijing, China',
      employees: '500+',
      marketShare: '40%',
      description: 'Market leader in consumer AR glasses with Google partnership'
    }
  },
  {
    id: 'xreal-one',
    brand: 'Xreal',
    model: 'One',
    fullName: 'Xreal One',
    price: 499,
    originalPrice: 549,
    currency: 'USD',
    availability: 'Available',
    image: '/api/placeholder/400/300',
    category: 'Mid-range',
    releaseDate: '2024',
    description: 'Affordable AR glasses with premium features',
    keyFeatures: [
      '50° Field of View',
      'Spatial Audio',
      '3 DoF tracking',
      'Multi-device compatibility',
      'Lightweight design'
    ],
    specifications: {
      display: {
        type: 'Micro-OLED',
        resolution: '1920×1080 per eye',
        refreshRate: '90Hz',
        brightness: '600 nits',
        fov: '50°',
        colorAccuracy: 'ΔE <4'
      },
      design: {
        weight: '79g',
        material: 'Aluminum frame',
        ipdAdjustment: 'Fixed',
        dimming: '2-level'
      },
      audio: {
        speakers: 'Spatial audio',
        microphones: '2 built-in',
        soundLeakage: 'Minimal'
      },
      connectivity: {
        connection: 'USB-C',
        compatibility: ['iPhone', 'Android', 'PC', 'Steam Deck']
      },
      features: {
        tracking: '3 DoF',
        chip: 'Standard processor',
        latency: '5ms',
        camera: 'Basic'
      }
    },
    rating: 4.3,
    pros: [
      'Excellent value for money',
      'Wide device compatibility',
      'Lightweight design',
      'Good display quality'
    ],
    cons: [
      'Smaller field of view than Pro',
      'No premium audio',
      'Fixed IPD',
      'Basic tracking'
    ],
    companyInfo: {
      founded: '2017',
      headquarters: 'Beijing, China',
      employees: '500+',
      marketShare: '40%',
      description: 'Market leader in consumer AR glasses with Google partnership'
    }
  },

  // Rokid Products
  {
    id: 'rokid-ar-spatial',
    brand: 'Rokid',
    model: 'AR Spatial',
    fullName: 'Rokid AR Spatial',
    price: 598,
    originalPrice: 648,
    currency: 'USD',
    availability: 'Available',
    image: '/api/placeholder/400/300',
    category: 'Premium',
    releaseDate: '2024',
    description: 'Spatial computing AR glasses with proprietary LLM integration',
    keyFeatures: [
      'Proprietary LLM',
      'Scene recognition',
      'Subtitle projection',
      'Voice commands',
      'Spatial computing'
    ],
    specifications: {
      display: {
        type: 'Micro-OLED',
        resolution: '1920×1080 per eye',
        refreshRate: '90Hz',
        brightness: '1000 nits',
        fov: '43°',
        colorAccuracy: 'High'
      },
      design: {
        weight: '83g',
        material: 'Premium plastic',
        ipdAdjustment: '58-72mm',
        dimming: 'Adaptive'
      },
      audio: {
        speakers: 'Directional speakers',
        microphones: '4 array',
        soundLeakage: 'Minimal'
      },
      connectivity: {
        connection: 'USB-C + Wireless',
        compatibility: ['Android', 'iOS', 'PC', 'Mac']
      },
      features: {
        tracking: '6 DoF',
        chip: 'Qualcomm XR2+ Gen 1',
        latency: '20ms',
        camera: 'RGB + depth'
      }
    },
    rating: 4.4,
    pros: [
      'Advanced AI integration',
      'Excellent scene recognition',
      'Strong spatial computing',
      'Good build quality',
      '6 DoF tracking'
    ],
    cons: [
      'Higher latency',
      'Limited app ecosystem',
      'Requires learning curve',
      'Battery life could be better'
    ],
    companyInfo: {
      founded: '2014',
      headquarters: 'Hangzhou, China',
      employees: '300+',
      marketShare: '8%',
      description: 'Spatial computing pioneer with proprietary LLM integration'
    }
  },

  // Viture Products
  {
    id: 'viture-pro-xr',
    brand: 'Viture',
    model: 'Pro XR',
    fullName: 'Viture Pro XR',
    price: 449,
    originalPrice: 499,
    currency: 'USD',
    availability: 'Available',
    image: '/api/placeholder/400/300',
    category: 'Mid-range',
    releaseDate: '2024',
    description: 'XR glasses with real-time 2D-to-3D conversion and AI workspace',
    keyFeatures: [
      'Real-time 2D-to-3D conversion',
      'AI-powered multiscreen workspace',
      'Electrochromic dimming',
      'Harman AudioEFX',
      'Universal compatibility'
    ],
    specifications: {
      display: {
        type: 'Sony Micro-OLED',
        resolution: '1920×1080 per eye',
        refreshRate: '120Hz',
        brightness: '4000 nits',
        fov: '43°',
        colorAccuracy: '100% sRGB'
      },
      design: {
        weight: '78g',
        material: 'Aluminum alloy',
        ipdAdjustment: '56-72mm',
        dimming: 'Electrochromic'
      },
      audio: {
        speakers: 'Harman AudioEFX',
        microphones: 'Dual array',
        soundLeakage: 'Reduced'
      },
      connectivity: {
        connection: 'USB-C DP Alt Mode',
        compatibility: ['iPhone 15+', 'Android', 'PC', 'Mac', 'Steam Deck', 'Switch']
      },
      features: {
        tracking: '3 DoF',
        chip: 'Custom processor',
        latency: '<20ms',
        camera: 'None'
      }
    },
    rating: 4.2,
    pros: [
      'Excellent brightness (4000 nits)',
      'Real-time 2D-to-3D conversion',
      'Premium audio quality',
      'Wide device compatibility',
      'Electrochromic dimming'
    ],
    cons: [
      'No built-in camera',
      'Limited to 3 DoF',
      'Smaller ecosystem',
      'Higher power consumption'
    ],
    companyInfo: {
      founded: '2021',
      headquarters: 'Beijing/San Francisco',
      employees: '200+',
      marketShare: '5%',
      description: 'Series-B startup focusing on XR innovation with AI features'
    }
  },

  // RayNeo Products
  {
    id: 'rayneo-air-3s',
    brand: 'RayNeo',
    model: 'Air 3s',
    fullName: 'RayNeo Air 3s',
    price: 269,
    originalPrice: 299,
    currency: 'USD',
    availability: 'Available',
    image: '/api/placeholder/400/300',
    category: 'Budget',
    releaseDate: '2024',
    description: 'Affordable AR glasses with essential features',
    keyFeatures: [
      'Budget-friendly pricing',
      'Lightweight design',
      'Basic AR functionality',
      'Multi-device support',
      'Comfortable fit'
    ],
    specifications: {
      display: {
        type: 'LCD',
        resolution: '1920×1080 per eye',
        refreshRate: '60Hz',
        brightness: '400 nits',
        fov: '40°',
        colorAccuracy: 'Standard'
      },
      design: {
        weight: '75g',
        material: 'Plastic frame',
        ipdAdjustment: 'Fixed',
        dimming: 'Manual'
      },
      audio: {
        speakers: 'Basic speakers',
        microphones: '1 built-in',
        soundLeakage: 'Moderate'
      },
      connectivity: {
        connection: 'USB-C',
        compatibility: ['Android', 'PC', 'Some iOS devices']
      },
      features: {
        tracking: 'Basic',
        chip: 'Entry-level',
        latency: '30ms',
        camera: 'None'
      }
    },
    rating: 3.8,
    pros: [
      'Very affordable price',
      'Lightweight and comfortable',
      'Good entry-level option',
      'Decent display quality'
    ],
    cons: [
      'Limited features',
      'Basic build quality',
      'Higher latency',
      'No advanced tracking'
    ],
    companyInfo: {
      founded: '2022',
      headquarters: 'Shenzhen, China',
      employees: '150+',
      marketShare: '3%',
      description: 'TCL spin-out focusing on consumer XR with gesture control'
    }
  },
  {
    id: 'rayneo-x3-pro',
    brand: 'RayNeo',
    model: 'X3 Pro',
    fullName: 'RayNeo X3 Pro',
    price: 899,
    originalPrice: 999,
    currency: 'USD',
    availability: 'Available',
    image: '/api/placeholder/400/300',
    category: 'Premium',
    releaseDate: '2024',
    description: 'Advanced AR glasses with gesture control and SLAM navigation',
    keyFeatures: [
      'Multi-language dialogue translation',
      'SLAM navigation',
      'Gesture control',
      'Advanced optics',
      'Professional features'
    ],
    specifications: {
      display: {
        type: 'Micro-OLED',
        resolution: '1920×1080 per eye',
        refreshRate: '90Hz',
        brightness: '800 nits',
        fov: '45°',
        colorAccuracy: 'High'
      },
      design: {
        weight: '89g',
        material: 'Aluminum frame',
        ipdAdjustment: '58-72mm',
        dimming: 'Adaptive'
      },
      audio: {
        speakers: 'Directional audio',
        microphones: '3 array',
        soundLeakage: 'Minimal'
      },
      connectivity: {
        connection: 'USB-C + Wireless',
        compatibility: ['Android', 'iOS', 'PC', 'Mac']
      },
      features: {
        tracking: '6 DoF + SLAM',
        chip: 'Qualcomm XR2',
        latency: '25ms',
        camera: 'RGB + ToF'
      }
    },
    rating: 4.1,
    pros: [
      'Advanced gesture control',
      'SLAM navigation',
      'Multi-language translation',
      'Professional build quality',
      'Good tracking accuracy'
    ],
    cons: [
      'Higher price point',
      'Complex setup',
      'Learning curve required',
      'Limited app selection'
    ],
    companyInfo: {
      founded: '2022',
      headquarters: 'Shenzhen, China',
      employees: '150+',
      marketShare: '3%',
      description: 'TCL spin-out focusing on consumer XR with gesture control'
    }
  },

  // Other products follow the same pattern...
  // For brevity, I'll include a few more key products

  {
    id: 'even-realities-g1',
    brand: 'Even Realities',
    model: 'G1',
    fullName: 'Even Realities G1',
    price: 599,
    originalPrice: 599,
    currency: 'USD',
    availability: 'Available',
    image: '/api/placeholder/400/300',
    category: 'Everyday',
    releaseDate: '2024',
    description: 'Everyday smart glasses with AI and micro-LED display',
    keyFeatures: [
      'Micro-LED display',
      'Even AI integration',
      'Turn-by-turn navigation',
      'Voice-to-text notes',
      'Prescription support'
    ],
    specifications: {
      display: {
        type: 'Micro-LED',
        resolution: '640×200 per eye',
        refreshRate: '20Hz',
        brightness: '1000 nits',
        fov: '25°',
        colorAccuracy: 'Green monochrome'
      },
      design: {
        weight: 'Lightweight',
        material: 'Premium frames',
        ipdAdjustment: 'Custom fitting',
        dimming: 'Transparent'
      },
      audio: {
        speakers: 'None (requires earbuds)',
        microphones: '2 built-in',
        soundLeakage: 'N/A'
      },
      connectivity: {
        connection: 'Bluetooth 5.2',
        compatibility: ['iOS', 'Android']
      },
      features: {
        tracking: 'Basic',
        chip: 'Custom processor',
        latency: 'Low',
        camera: 'None'
      }
    },
    rating: 4.4,
    pros: [
      'Everyday wearable design',
      'Excellent AI features',
      'Great navigation',
      'Premium build quality'
    ],
    cons: [
      'Monochrome display',
      'No speakers',
      'Limited field of view',
      'High price for features'
    ],
    companyInfo: {
      founded: '2023',
      headquarters: 'Shenzhen, China',
      employees: '50+',
      marketShare: '1%',
      description: 'Luxury eyewear meets tech for everyday smart glasses'
    }
  },

  {
    id: 'brilliant-labs-frame',
    brand: 'Brilliant Labs',
    model: 'Frame',
    fullName: 'Brilliant Labs Frame',
    price: 349,
    originalPrice: 349,
    currency: 'USD',
    availability: 'Sold Out',
    image: '/api/placeholder/400/300',
    category: 'Developer',
    releaseDate: '2024',
    description: 'Open-source AI-powered smart glasses for developers and hackers',
    keyFeatures: [
      'Open-source platform',
      'Perplexity AI integration',
      'Visual analysis',
      'Live translation',
      'Developer-friendly'
    ],
    specifications: {
      display: {
        type: 'Color OLED',
        resolution: '640×400 per eye',
        refreshRate: '60Hz',
        brightness: '500 nits',
        fov: '20°',
        colorAccuracy: 'Full color'
      },
      design: {
        weight: '40g',
        material: 'Lightweight frame',
        ipdAdjustment: '58-72mm',
        dimming: 'None'
      },
      audio: {
        speakers: 'None (requires earbuds)',
        microphones: '1 built-in',
        soundLeakage: 'N/A'
      },
      connectivity: {
        connection: 'Bluetooth 5.3',
        compatibility: ['iOS', 'Android']
      },
      features: {
        tracking: '3-axis accelerometer',
        chip: 'nrf52 + FPGA',
        latency: 'Low',
        camera: '720p RGB'
      }
    },
    rating: 4.0,
    pros: [
      'Fully open-source',
      'Great for developers',
      'AI integration',
      'Very lightweight'
    ],
    cons: [
      'Developer-focused',
      'Limited consumer apps',
      'No speakers',
      'Small display'
    ],
    companyInfo: {
      founded: '2019',
      headquarters: 'Hong Kong',
      employees: '30+',
      marketShare: '<1%',
      description: 'Open-source AR platform for developers and creative technologists'
    }
  }
];

export const arGlassesData: Product[] = rawArGlassesData.map(transformProduct);

export default arGlassesData;