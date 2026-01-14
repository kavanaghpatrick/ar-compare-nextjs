'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ChevronUp, 
  ChevronDown,
  TrendingUp,
  Target,
  Search,
  Grid3X3,
  HelpCircle,
  Menu,
  X
} from 'lucide-react';

interface PageNavigationProps {
  className?: string;
}

export function PageNavigation({ className = '' }: PageNavigationProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState('');

  const navigationItems = [
    { id: 'market-insights', label: 'Market Overview', icon: TrendingUp },
    { id: 'buying-guide', label: 'Buying Guide', icon: Target },
    { id: 'search-section', label: 'Search & Filter', icon: Search },
    { id: 'products-section', label: 'All Products', icon: Grid3X3 },
    { id: 'faq-section', label: 'FAQ', icon: HelpCircle },
  ];

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    const handleScroll = () => {
      toggleVisibility();
      
      // Update active section based on scroll position
      const sections = navigationItems.map(item => item.id);
      const currentSection = sections.find(sectionId => {
        const element = document.getElementById(sectionId);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });
      
      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80; // Account for fixed header
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsExpanded(false);
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Mobile Navigation Toggle */}
      <div className={`fixed bottom-4 left-4 lg:hidden [z-index:var(--z-fixed)] ${className}`}>
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          className="rounded-full w-12 h-12 shadow-lg bg-blue-600 hover:bg-blue-700"
          size="sm"
        >
          {isExpanded ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </Button>
      </div>

      {/* Desktop Floating Navigation */}
      <Card className={`fixed right-4 top-1/2 transform -translate-y-1/2 [z-index:var(--z-fixed)] hidden lg:block shadow-xl ${className}`}>
        <CardContent className="p-2">
          <div className="flex flex-col space-y-1">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activeSection === item.id;
              
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => scrollToSection(item.id)}
                  className={`justify-start text-xs w-40 ${
                    isActive 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <IconComponent className="h-3 w-3 mr-2" />
                  {item.label}
                </Button>
              );
            })}
            
            <div className="border-t pt-2 mt-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={scrollToTop}
                className="justify-start text-xs w-40 text-gray-600 hover:text-gray-900"
              >
                <ChevronUp className="h-3 w-3 mr-2" />
                Back to Top
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Expanded Navigation */}
      {isExpanded && (
        <div className="fixed inset-0 [z-index:var(--z-modal-backdrop)] lg:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsExpanded(false)} />
          <Card className="absolute bottom-20 left-4 right-4 shadow-xl">
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeSection === item.id;
                  
                  return (
                    <Button
                      key={item.id}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => scrollToSection(item.id)}
                      className={`justify-start text-xs ${
                        isActive 
                          ? 'bg-blue-600 text-white hover:bg-blue-700' 
                          : ''
                      }`}
                    >
                      <IconComponent className="h-3 w-3 mr-2" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
              
              <div className="border-t pt-3 mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={scrollToTop}
                  className="w-full justify-start text-xs"
                >
                  <ChevronUp className="h-3 w-3 mr-2" />
                  Back to Top
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Back to Top Button */}
      <div className={`fixed bottom-4 right-4 [z-index:var(--z-fixed)] ${className}`}>
        <Button
          onClick={scrollToTop}
          className="rounded-full w-12 h-12 shadow-lg bg-gray-900 hover:bg-gray-800 text-white"
          size="sm"
        >
          <ChevronUp className="h-5 w-5" />
        </Button>
      </div>
    </>
  );
}

// Quick navigation breadcrumb component
interface QuickNavProps {
  className?: string;
}

export function QuickNav({ className = '' }: QuickNavProps) {
  const quickLinks = [
    { label: 'Market Leaders', href: '#market-insights' },
    { label: 'Find My Match', href: '#buying-guide' },
    { label: 'Compare All', href: '#products-section' },
    { label: 'FAQ', href: '#faq-section' },
  ];

  const handleClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    const sectionId = href.replace('#', '');
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className={`bg-gradient-to-r from-blue-50 to-indigo-50 border-b ${className}`}>
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-center space-x-1 text-sm">
          <span className="text-gray-600 hidden sm:inline">Quick access:</span>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-4">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                onClick={(e) => handleClick(link.href, e)}
                className="text-blue-600 hover:text-blue-800 hover:underline font-medium transition-colors px-2 py-1 rounded hover:bg-blue-100"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}