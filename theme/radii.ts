export const radii = {
  xs: 6,
  sm: 8,
  md: 12,
  card: 16,     // Bo góc thẻ: 14-16px (chuẩn PDF: 16px)
  input: 14,    // Bo góc ô nhập liệu: 14px
  chip: 20,     // Bo góc chip: 18-20px (chuẩn PDF: 20px)
  button: 26,   // Bo góc nút: 26px (cao 52px)
  circle: 9999, // Bo tròn hoàn toàn
} as const;

export type Radii = typeof radii;
