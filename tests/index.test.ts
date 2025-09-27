import { getNextContrastColor, getContrastColors } from '../src/index';

describe('index.ts exports', () => {
  test('should export getNextContrastColor function', () => {
    expect(typeof getNextContrastColor).toBe('function');
  });

  test('should export getContrastColors function', () => {
    expect(typeof getContrastColors).toBe('function');
  });

  test('getNextContrastColor should work correctly through index export', () => {
    const color = getNextContrastColor(0);
    expect(color).toHaveProperty('hsl');
    expect(color).toHaveProperty('hslString');
    expect(color.hsl).toEqual({ h: 0, s: 100, l: 50 });
    expect(color.hslString).toBe('hsl(0, 100%, 50%)');
  });

  test('getContrastColors should work correctly through index export', () => {
    const colors = getContrastColors(3);
    expect(colors).toHaveLength(3);
    expect(colors[0]?.hsl).toEqual({ h: 0, s: 100, l: 50 });
    expect(colors[1]?.hsl).toEqual({ h: 120, s: 100, l: 50 });
    expect(colors[2]?.hsl).toEqual({ h: 240, s: 100, l: 50 });
  });

  test('exported functions should accept options correctly', () => {
    const colorWithOffset = getNextContrastColor(0, { hOffset: 30 });
    expect(colorWithOffset.hsl.h).toBe(30);

    const colorsWithOptions = getContrastColors(2, { hOffset: 60, noGreyscale: true });
    expect(colorsWithOptions[0]?.hsl.h).toBe(60);
    expect(colorsWithOptions[1]?.hsl.h).toBe(180);
  });
});