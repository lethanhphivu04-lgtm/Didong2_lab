export const colors = {
  // Main backgrounds
  background: '#0F1412',
  surface: '#1A211E',
  surfaceHighlight: '#242D29',
  surfaceCard: '#1A211E',
  
  // Borders
  border: '#3A4640',
  borderLight: '#4A5851',
  
  // Typography
  textPrimary: '#F2F5F0',
  textSecondary: '#A3AEA8',
  textMuted: '#68756F',
  
  // Accent & Brand Colors
  primary: '#C6F432', // Neon Lime (PDF accent)
  primaryHover: '#D5F75E',
  primaryDark: '#A8D422',
  textOnPrimary: '#0F1412', // Black text on lime button
  
  // Status Colors
  success: '#7BE0A4', // Green
  warning: '#FFB454', // Orange
  danger: '#FF5C5C', // Red
  info: '#38BDF8', // Cyan
  
  // Overlays
  overlay: 'rgba(15, 20, 18, 0.75)',
  modalBackdrop: 'rgba(0, 0, 0, 0.8)',
} as const;

export type Colors = typeof colors;
