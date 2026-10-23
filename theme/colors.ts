export const colors = {
  // Main backgrounds (CaFit Dark Slate)
  background: '#12161A',
  surface: '#1A2026',
  surfaceHighlight: '#222A32',
  surfaceCard: '#1A2026',
  
  // Borders
  border: '#2A3440',
  borderLight: '#3A4654',
  
  // Typography
  textPrimary: '#FFFFFF',
  textSecondary: '#8C96A3',
  textMuted: '#586472',
  
  // Accent & Brand Colors (CaFit Coral & Warm Orange)
  primary: '#FF724E', // CaFit Coral Accent
  primaryHover: '#FF8A65',
  primaryDark: '#E55A36',
  primaryGradientStart: '#FF724E',
  primaryGradientEnd: '#FFA07A',
  textOnPrimary: '#FFFFFF', // Clean White text on Coral button
  
  // CaFit Specialized Accents
  water: '#38B6FF', // CaFit Water Blue
  waterDark: '#1E88E5',
  heart: '#FF4D4D', // CaFit Cardio Red/BPM
  lime: '#C6F432',  // Biomechanics & posture accent
  
  // Status Colors
  success: '#4CAF50', // Green
  warning: '#FFA726', // Orange
  danger: '#FF5252', // Red
  info: '#38B6FF', // Cyan / Water
  
  // Overlays
  overlay: 'rgba(18, 22, 26, 0.75)',
  modalBackdrop: 'rgba(0, 0, 0, 0.85)',
} as const;

export type Colors = typeof colors;
