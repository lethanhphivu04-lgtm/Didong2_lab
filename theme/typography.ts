export const fontFamilies = {
  regular: 'BeVietnamPro_400Regular',
  semiBold: 'BeVietnamPro_600SemiBold',
  bold: 'BeVietnamPro_700Bold',
};

export const typography = {
  fonts: fontFamilies,
  sizes: {
    xs: 12,
    sm: 13,
    base: 15,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    hero: 32,
    display: 40,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.6,
  },
} as const;

export type Typography = typeof typography;
