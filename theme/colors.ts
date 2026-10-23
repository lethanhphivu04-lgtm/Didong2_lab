export const colors = {
  // Main backgrounds (CaFit Authentic Clean Light)
  background: '#F8F9FA',
  surface: '#FFFFFF',
  surfaceHighlight: '#F1F3F6',
  surfaceCard: '#FFFFFF',
  
  // Borders (CaFit subtle clean borders)
  border: '#E8ECEF',
  borderLight: '#F0F2F5',
  
  // Typography (CaFit #221E3A / #373447 dark text)
  textPrimary: '#221E3A',
  textSecondary: '#7A828A',
  textMuted: '#A4A2AA',
  
  // Accent & Brand Colors (CaFit Coral & Warm Orange)
  primary: '#FF724E', // CaFit Coral Primary
  primaryHover: '#FF8A65',
  primaryDark: '#E55A36',
  primaryGradientStart: '#FF724E',
  primaryGradientEnd: '#FF9B70',
  textOnPrimary: '#FFFFFF', // Clean White text on Coral button
  
  // CaFit Specialized Accents
  water: '#38B6FF', // CaFit Water Blue
  waterDark: '#1E88E5',
  heart: '#FF4D4D', // CaFit Cardio Red/BPM
  lime: '#4CAF50',  // High-contrast fitness green
  
  // Status Colors
  success: '#4CAF50', // Green
  warning: '#FFA726', // Orange
  danger: '#FF5252', // Red
  info: '#38B6FF', // Cyan / Water
  
  // Overlays & Shadows
  cardShadow: 'rgba(34, 30, 58, 0.06)',
  overlay: 'rgba(34, 30, 58, 0.45)',
  modalBackdrop: 'rgba(0, 0, 0, 0.65)',
} as const;

export type Colors = typeof colors;
