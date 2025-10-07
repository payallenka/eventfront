// Responsive utility functions and constants

// Standard responsive breakpoints
export const breakpoints = {
  xs: 475,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
};

// Responsive clamp function helpers
export const responsiveClamp = {
  // Text sizes
  textXs: 'clamp(0.75rem, 2vw, 0.875rem)',
  textSm: 'clamp(0.875rem, 2.5vw, 1rem)',
  textBase: 'clamp(1rem, 3vw, 1.125rem)',
  textLg: 'clamp(1.125rem, 3.5vw, 1.25rem)',
  textXl: 'clamp(1.25rem, 4vw, 1.5rem)',
  text2Xl: 'clamp(1.5rem, 5vw, 2rem)',
  text3Xl: 'clamp(2rem, 6vw, 2.5rem)',
  
  // Spacing
  spaceXs: 'clamp(0.25rem, 1vw, 0.5rem)',
  spaceSm: 'clamp(0.5rem, 1.5vw, 0.75rem)',
  spaceBase: 'clamp(0.75rem, 2vw, 1rem)',
  spaceMd: 'clamp(1rem, 3vw, 1.5rem)',
  spaceLg: 'clamp(1.5rem, 4vw, 2rem)',
  spaceXl: 'clamp(2rem, 5vw, 3rem)',
  
  // Button padding
  buttonPadding: 'clamp(0.75rem, 2vw, 1rem)',
  buttonPaddingLarge: 'clamp(1rem, 3vw, 1.5rem)',
  
  // Container padding
  containerPadding: 'clamp(1rem, 4vw, 2rem)',
  headerPadding: 'clamp(16px, 4vw, 32px)',
  
  // Border radius
  radiusSm: 'clamp(4px, 1vw, 6px)',
  radiusBase: 'clamp(6px, 1.5vw, 8px)',
  radiusLg: 'clamp(8px, 2vw, 12px)',
  radiusXl: 'clamp(12px, 3vw, 16px)',
  
  // Icon sizes
  iconSm: 'clamp(14px, 3vw, 16px)',
  iconBase: 'clamp(16px, 3.5vw, 20px)',
  iconLg: 'clamp(20px, 4vw, 24px)',
  iconXl: 'clamp(24px, 5vw, 32px)',
  
  // Input heights
  inputHeight: 'clamp(44px, 8vw, 48px)',
  buttonHeight: 'clamp(44px, 8vw, 48px)',
};

// Common responsive styles for forms
export const responsiveFormStyles = {
  input: {
    padding: responsiveClamp.buttonPadding,
    fontSize: responsiveClamp.textSm,
    borderRadius: responsiveClamp.radiusLg,
    minHeight: responsiveClamp.inputHeight,
    transition: 'all 0.15s ease-in-out'
  },
  
  button: {
    padding: responsiveClamp.buttonPadding,
    fontSize: responsiveClamp.textSm,
    borderRadius: responsiveClamp.radiusBase,
    minHeight: responsiveClamp.buttonHeight,
    transition: 'all 0.2s ease-in-out',
    cursor: 'pointer',
    border: 'none',
    fontWeight: '600'
  },
  
  container: {
    padding: responsiveClamp.containerPadding,
    borderRadius: responsiveClamp.radiusXl,
    width: '100%',
    maxWidth: 'clamp(320px, 90vw, 600px)'
  }
};

// Media query helper
export const mediaQuery = (breakpoint) => `@media (min-width: ${breakpoints[breakpoint]}px)`;

// Check if current screen size matches breakpoint
export const useMediaQuery = (breakpoint) => {
  if (typeof window === 'undefined') return false;
  return window.innerWidth >= breakpoints[breakpoint];
};

// Get responsive grid columns based on screen size
export const getResponsiveColumns = (items, maxColumns = 3) => {
  if (typeof window === 'undefined') return 1;
  
  const width = window.innerWidth;
  if (width < breakpoints.sm) return 1;
  if (width < breakpoints.md) return Math.min(2, maxColumns);
  if (width < breakpoints.lg) return Math.min(2, maxColumns);
  return Math.min(maxColumns, items);
};

// Responsive gap utility
export const getResponsiveGap = (size = 'base') => {
  const gaps = {
    xs: responsiveClamp.spaceXs,
    sm: responsiveClamp.spaceSm,
    base: responsiveClamp.spaceBase,
    md: responsiveClamp.spaceMd,
    lg: responsiveClamp.spaceLg,
    xl: responsiveClamp.spaceXl
  };
  return gaps[size] || gaps.base;
};
