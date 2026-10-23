export const radii = {
  xs: 6,
  sm: 8,
  md: 12,
  card: 20,     // Bo góc thẻ chuẩn CaFit: 20px
  input: 16,    // Bo góc ô nhập liệu: 16px
  chip: 20,     // Bo góc chip: 20px
  button: 26,   // Bo góc nút pill chuẩn CaFit: 26px (cao 52px)
  circle: 9999, // Bo tròn hoàn toàn
} as const;

export type Radii = typeof radii;
