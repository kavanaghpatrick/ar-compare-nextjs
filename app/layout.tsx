import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/navigation.css";
import "../styles/quickview.css";
import { ComparisonProvider } from "@/contexts/ComparisonContext";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'AR Compare - Compare AR Glasses & Smart Glasses',
    template: '%s | AR Compare'
  },
  description: 'Compare the latest AR glasses and smart glasses. Find detailed specs, prices, and reviews.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Remove ALL the performance optimization and complex CSS for now */}
        <style dangerouslySetInnerHTML={{ __html: `
          /* Basic reset */
          * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box; 
          }
          
          /* Simple body styles */
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
            color: #ffffff;
            min-height: 100vh;
            line-height: 1.6;
          }
          
          /* App container */
          .app-container {
            min-height: 100vh;
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%);
          }
          
          /* Container spacing */
          .max-w-7xl {
            max-width: 80rem;
          }
          
          .mx-auto {
            margin-left: auto;
            margin-right: auto;
          }
          
          .px-4 {
            padding-left: 1rem;
            padding-right: 1rem;
          }
          
          .py-8 {
            padding-top: 2rem;
            padding-bottom: 2rem;
          }
          
          /* Critical table fixes for comparison page */
          .comparison-table {
            width: 100%;
            border-collapse: collapse;
            table-layout: auto;
          }
          
          .comparison-table thead {
            display: table-header-group;
          }
          
          .comparison-table thead tr {
            display: table-row;
          }
          
          .comparison-table th {
            display: table-cell;
            vertical-align: top;
            text-align: left;
            padding: 1rem;
            background: rgba(255, 255, 255, 0.1);
            border-bottom: 1px solid rgba(255, 255, 255, 0.2);
            min-width: 200px;
          }
          
          .comparison-table .spec-header {
            position: sticky;
            left: 0;
            background: rgba(255, 255, 255, 0.2);
            z-index: 10;
            min-width: 200px;
          }
          
          .comparison-table .product-header {
            min-width: 200px;
            max-width: 250px;
          }
          
          .product-header-content {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
          }
          
          .product-info {
            display: flex;
            flex-direction: column;
          }
          
          .product-name {
            font-weight: bold;
            color: #ffffff;
            font-size: 0.9rem;
            line-height: 1.3;
          }
          
          .product-price {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.8rem;
          }
          
          /* Remove ALL pointer-events manipulation */
          /* Remove ALL z-index hacks */
          /* Remove ALL complex selectors */
          
          /* Only the most basic link styles */
          a {
            color: inherit;
            text-decoration: none;
          }
          
          /* Skip link for accessibility */
          .skip-to-content {
            position: absolute;
            top: -40px;
            left: 0;
            background: #000;
            color: #fff;
            padding: 8px;
            text-decoration: none;
            z-index: 100;
          }
          
          .skip-to-content:focus {
            top: 0;
          }
          
          /* Enhanced Homepage Styles */
          .hero-enhanced {
            background: linear-gradient(135deg, #0f172a 0%, #1e3a8a 30%, #3b82f6 60%, #0f172a 100%);
            position: relative;
            overflow: hidden;
            padding: 4rem 1rem 6rem;
            min-height: 100vh;
            display: flex;
            align-items: center;
          }
          
          .hero-enhanced::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: 
              radial-gradient(circle at 30% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%),
              radial-gradient(circle at 70% 80%, rgba(139, 92, 246, 0.2) 0%, transparent 50%);
            pointer-events: none;
          }
          
          .hero-container {
            max-width: 1200px;
            margin: 0 auto;
            text-align: center;
            position: relative;
            z-index: 1;
          }
          
          .trust-badges {
            display: flex;
            justify-content: center;
            gap: 2rem;
            margin-bottom: 2rem;
            flex-wrap: wrap;
          }
          
          .trust-badge {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            padding: 0.75rem 1.5rem;
            border-radius: 50px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #ffffff;
            font-size: 0.9rem;
          }
          
          .trust-icon {
            width: 16px;
            height: 16px;
            color: #10b981;
          }
          
          .hero-title-enhanced {
            font-size: clamp(2.5rem, 5vw, 4.5rem);
            font-weight: 800;
            line-height: 1.1;
            letter-spacing: -0.02em;
            background: linear-gradient(135deg, #ffffff 0%, #ddd6fe 30%, #93c5fd 70%, #c7d2fe 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            margin-bottom: 1.5rem;
            position: relative;
          }
          
          .hero-subtitle-enhanced {
            font-size: 1.25rem;
            color: rgba(255, 255, 255, 0.8);
            max-width: 700px;
            margin: 0 auto 3rem;
            line-height: 1.6;
          }
          
          .value-props {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 2rem;
            margin: 3rem 0;
            max-width: 900px;
            margin-left: auto;
            margin-right: auto;
          }
          
          .value-prop {
            display: flex;
            align-items: flex-start;
            gap: 1rem;
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            padding: 1.5rem;
            border-radius: 16px;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .value-icon {
            width: 24px;
            height: 24px;
            color: #3b82f6;
            flex-shrink: 0;
            margin-top: 0.25rem;
          }
          
          .value-prop h3 {
            color: #ffffff;
            font-size: 1.1rem;
            font-weight: 600;
            margin-bottom: 0.5rem;
          }
          
          .value-prop p {
            color: rgba(255, 255, 255, 0.7);
            font-size: 0.9rem;
            margin: 0;
          }
          
          .hero-actions {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin: 3rem 0;
            flex-wrap: wrap;
          }
          
          .cta-primary {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border: none;
            padding: 1rem 2rem;
            border-radius: 50px;
            color: white;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
          }
          
          .cta-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(59, 130, 246, 0.4);
          }
          
          .cta-secondary {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 2px solid rgba(255, 255, 255, 0.2);
            padding: 1rem 2rem;
            border-radius: 50px;
            color: white;
            font-weight: 600;
            font-size: 1.1rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          
          .cta-secondary:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.4);
            transform: translateY(-2px);
          }
          
          .cta-icon {
            width: 18px;
            height: 18px;
          }
          
          .social-proof {
            margin-top: 3rem;
            text-align: center;
          }
          
          .social-proof-text {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 1rem;
            font-size: 1rem;
          }
          
          .rating-display {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 1rem;
          }
          
          .stars {
            display: flex;
            gap: 0.25rem;
          }
          
          .star-filled {
            width: 20px;
            height: 20px;
            color: #fbbf24;
            fill: currentColor;
          }
          
          .search-section-enhanced {
            background: rgba(255, 255, 255, 0.02);
            padding: 4rem 1rem;
            display: block;
          }
          
          .search-container {
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .search-title {
            text-align: center;
            font-size: 2.5rem;
            font-weight: 700;
            color: #ffffff;
            margin-bottom: 3rem;
            width: 100%;
            display: block;
          }
          
          .search-bar-enhanced {
            max-width: 600px;
            margin: 0 auto 3rem;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          
          .popular-searches {
            display: flex;
            justify-content: center;
            gap: 1rem;
            margin-top: 1rem;
            flex-wrap: wrap;
          }
          
          .popular-label {
            color: rgba(255, 255, 255, 0.6);
            font-size: 0.9rem;
          }
          
          .popular-searches button {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: white;
            padding: 0.5rem 1rem;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
          }
          
          .popular-searches button:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.4);
          }
          
          .category-filter-enhanced {
            width: 100%;
            margin-top: 2rem;
          }
          
          .category-filter-enhanced h3 {
            text-align: center;
            font-size: 1.5rem;
            color: #ffffff;
            margin-bottom: 2rem;
            width: 100%;
            display: block;
          }
          
          .category-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
            gap: 0.5rem;
            max-width: 700px;
            margin: 0 auto;
          }
          
          .category-card {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 8px;
            padding: 0.5rem 0.75rem;
            cursor: pointer;
            transition: all 0.3s ease;
            display: flex;
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
            color: white;
            min-height: 40px;
            justify-content: space-between;
          }
          
          .category-card:hover {
            background: rgba(255, 255, 255, 0.1);
            border-color: rgba(59, 130, 246, 0.4);
            transform: translateY(-2px);
          }
          
          .category-card.active {
            background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(139, 92, 246, 0.2));
            border-color: #3b82f6;
          }
          
          .category-icon {
            width: 16px;
            height: 16px;
            color: #3b82f6;
          }
          
          .category-card span:not(.category-count) {
            font-size: 0.8rem;
            font-weight: 500;
            line-height: 1.2;
            flex: 1;
            text-align: left;
          }
          
          .category-count {
            background: rgba(255, 255, 255, 0.2);
            padding: 0.15rem 0.5rem;
            border-radius: 8px;
            font-size: 0.7rem;
            font-weight: 600;
            flex-shrink: 0;
          }
          
          .products-section-enhanced {
            padding: 4rem 1rem;
          }
          
          /* Professional category icons */
          .category-icon-style {
            flex-shrink: 0;
            opacity: 0.9;
          }
          
          .product-category-indicator {
            display: flex;
            align-items: center;
            gap: 0.4rem;
            margin-bottom: 0.75rem;
            padding: 0.25rem 0.5rem;
            background: rgba(255, 255, 255, 0.05);
            border-radius: 6px;
            width: fit-content;
            border: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .product-icon {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .products-container {
            max-width: 1200px;
            margin: 0 auto;
          }
          
          .results-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 2rem;
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .results-title {
            font-size: 1.8rem;
            color: #ffffff;
            font-weight: 600;
          }
          
          .category-filter-indicator, .search-filter-indicator {
            color: #3b82f6;
            font-weight: normal;
          }
          
          .clear-filters-btn {
            background: rgba(239, 68, 68, 0.2);
            border: 1px solid rgba(239, 68, 68, 0.4);
            color: #fca5a5;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            cursor: pointer;
            font-size: 0.9rem;
            transition: all 0.3s ease;
          }
          
          .clear-filters-btn:hover {
            background: rgba(239, 68, 68, 0.3);
          }
          
          .products-grid-enhanced {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
            gap: 2rem;
          }
          
          .product-card-wrapper {
            animation: fadeInUp 0.6s ease-out forwards;
            opacity: 0;
            transform: translateY(30px);
          }
          
          @keyframes fadeInUp {
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .no-results {
            text-align: center;
            padding: 4rem 2rem;
          }
          
          .no-results-content {
            max-width: 400px;
            margin: 0 auto;
          }
          
          .no-results-icon {
            width: 64px;
            height: 64px;
            color: rgba(255, 255, 255, 0.4);
            margin: 0 auto 1rem;
            display: block;
          }
          
          .no-results h3 {
            color: #ffffff;
            font-size: 1.5rem;
            margin-bottom: 1rem;
          }
          
          .no-results p {
            color: rgba(255, 255, 255, 0.7);
            margin-bottom: 2rem;
          }
          
          .reset-search-btn {
            background: linear-gradient(135deg, #3b82f6, #8b5cf6);
            border: none;
            color: white;
            padding: 0.75rem 2rem;
            border-radius: 8px;
            cursor: pointer;
            font-weight: 600;
            transition: all 0.3s ease;
          }
          
          .reset-search-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
          }
          
          .faq-section {
            background: rgba(255, 255, 255, 0.02);
            padding: 4rem 1rem;
          }
          
          .faq-container {
            max-width: 1000px;
            margin: 0 auto;
          }
          
          .faq-section h2 {
            text-align: center;
            font-size: 2.5rem;
            color: #ffffff;
            margin-bottom: 3rem;
          }
          
          .faq-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
          }
          
          .faq-item {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-radius: 16px;
            padding: 2rem;
          }
          
          .faq-item h3 {
            color: #ffffff;
            font-size: 1.2rem;
            margin-bottom: 1rem;
            font-weight: 600;
          }
          
          .faq-item p {
            color: rgba(255, 255, 255, 0.8);
            line-height: 1.6;
            margin: 0;
          }
          
          /* Override any conflicting layout styles */
          .search-section-enhanced * {
            box-sizing: border-box;
          }
          
          .search-section-enhanced .search-container > * {
            margin-left: auto;
            margin-right: auto;
          }
          
          /* Ensure proper stacking - force vertical layout */
          .search-section-enhanced .search-title,
          .search-section-enhanced .search-bar-enhanced,
          .search-section-enhanced .category-filter-enhanced {
            display: block !important;
            width: 100% !important;
            float: none !important;
            clear: both !important;
          }
          
          /* Force block layout for all children */
          .search-section-enhanced .search-container {
            display: block !important;
            flex-direction: column !important;
          }
          
          .search-section-enhanced .search-container > div {
            display: block !important;
            width: 100% !important;
            margin-bottom: 2rem !important;
          }
          
          /* Mobile Responsive */
          @media (max-width: 768px) {
            .hero-enhanced {
              padding: 2rem 1rem 4rem;
              min-height: auto;
            }
            
            .hero-title-enhanced {
              font-size: 2.5rem;
            }
            
            .trust-badges {
              gap: 1rem;
            }
            
            .trust-badge {
              font-size: 0.8rem;
              padding: 0.5rem 1rem;
            }
            
            .value-props {
              grid-template-columns: 1fr;
              gap: 1rem;
            }
            
            .hero-actions {
              flex-direction: column;
              align-items: center;
            }
            
            .cta-primary, .cta-secondary {
              width: 100%;
              max-width: 300px;
            }
            
            .category-cards {
              grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
              gap: 0.4rem;
            }
            
            .category-card {
              padding: 0.4rem 0.6rem;
              min-height: 36px;
              gap: 0.4rem;
            }
            
            .category-card span:not(.category-count) {
              font-size: 0.75rem;
            }
            
            .category-count {
              font-size: 0.65rem;
              padding: 0.1rem 0.4rem;
            }
            
            .products-grid-enhanced {
              grid-template-columns: 1fr;
              gap: 1.5rem;
            }
            
            .results-header {
              flex-direction: column;
              align-items: flex-start;
            }
          }
        `}} />
      </head>
      <body className={`${inter.className} antialiased`}>
        <a href="#main-content" className="skip-to-content">
          Skip to main content
        </a>
        <ComparisonProvider>
          <main id="main-content">
            {children}
          </main>
        </ComparisonProvider>
      </body>
    </html>
  );
}