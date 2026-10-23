import { colors } from './colors';
import { typography, fontFamilies } from './typography';
import { spacing } from './spacing';
import { radii } from './radii';

export const theme = {
  colors,
  typography,
  fontFamilies,
  spacing,
  radii,
  minTapTarget: 44, // Vùng bấm tối thiểu 44px
  buttonHeight: 52, // Chiều cao nút chuẩn 52px
} as const;

export type Theme = typeof theme;

export * from './colors';
export * from './typography';
export * from './spacing';
export * from './radii';
