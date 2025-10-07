import { useState, useEffect } from 'react';

// Custom hook to track screen size and provide responsive utilities
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1024,
    height: typeof window !== 'undefined' ? window.innerHeight : 768
  });

  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({ width, height });
      
      // Update breakpoint states
      setIsMobile(width < 768);
      setIsTablet(width >= 768 && width < 1024);
      setIsDesktop(width >= 1024);
    };

    // Initial check
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Responsive utilities
  const getColumns = (maxCols = 3) => {
    if (isMobile) return 1;
    if (isTablet) return Math.min(2, maxCols);
    return maxCols;
  };

  const getGridTemplate = (maxCols = 3) => {
    const cols = getColumns(maxCols);
    return `repeat(${cols}, 1fr)`;
  };

  const isBreakpoint = (breakpoint) => {
    const breakpoints = {
      xs: 475,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      '2xl': 1536
    };
    return screenSize.width >= breakpoints[breakpoint];
  };

  return {
    screenSize,
    isMobile,
    isTablet,
    isDesktop,
    getColumns,
    getGridTemplate,
    isBreakpoint
  };
};
