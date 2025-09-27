import { getNextContrastColor, getContrastColors } from '../src/colors';

describe('getNextContrastColor', () => {
  describe('basic color generation', () => {
    test('should return default grey color for negative step', () => {
      const color = getNextContrastColor(-1);
      expect(color.hsl).toEqual({ h: 0, s: 0, l: 50 });
      expect(color.hslString).toBe('hsl(0, 0%, 50%)');
    });

    test('should return first color (red) for step 0', () => {
      const color = getNextContrastColor(0);
      expect(color.hsl.h).toBe(0);
      expect(color.hsl.s).toBe(100);
      expect(color.hsl.l).toBe(50);
      expect(color.hslString).toBe('hsl(0, 100%, 50%)');
    });

    test('should return green for step 1', () => {
      const color = getNextContrastColor(1);
      expect(color.hsl.h).toBe(120);
      expect(color.hsl.s).toBe(100);
      expect(color.hsl.l).toBe(50);
      expect(color.hslString).toBe('hsl(120, 100%, 50%)');
    });

    test('should return blue for step 2', () => {
      const color = getNextContrastColor(2);
      expect(color.hsl.h).toBe(240);
      expect(color.hsl.s).toBe(100);
      expect(color.hsl.l).toBe(50);
      expect(color.hslString).toBe('hsl(240, 100%, 50%)');
    });
  });

  describe('hue cycling (steps 0-11)', () => {
    test('should cycle through all 12 hues correctly', () => {
      const expectedHues = [0, 120, 240, 180, 300, 60, 270, 150, 30, 210, 330, 90];
      
      for (let i = 0; i < 12; i++) {
        const color = getNextContrastColor(i);
        expect(color.hsl.h).toBe(expectedHues[i]);
        expect(color.hsl.s).toBe(100);
        expect(color.hsl.l).toBe(50);
      }
    });
  });

  describe('lightness variation (steps 12-35)', () => {
    test('should vary lightness for second cycle', () => {
      // Step 12 should be same hue as step 0 but different lightness
      const color12 = getNextContrastColor(12);
      const color0 = getNextContrastColor(0);
      
      expect(color12.hsl.h).toBe(color0.hsl.h);
      expect(color12.hsl.s).toBe(100);
      expect(color12.hsl.l).toBe(32); // Different lightness
    });

    test('should cycle through lightness values correctly', () => {
      const expectedLightness = [50, 32, 63];
      
      for (let cycle = 0; cycle < 3; cycle++) {
        for (let hue = 0; hue < 12; hue++) {
          const step = cycle * 12 + hue;
          const color = getNextContrastColor(step);
          expect(color.hsl.l).toBe(expectedLightness[cycle]);
        }
      }
    });
  });

  describe('saturation variation (steps 36-71)', () => {
    test('should vary saturation after lightness cycles', () => {
      const color36 = getNextContrastColor(36);
      expect(color36.hsl.h).toBe(0);
      expect(color36.hsl.s).toBe(50); // Different saturation
      expect(color36.hsl.l).toBe(50);
    });
  });

  describe('greyscale colors (steps 72+)', () => {
    test('should return greyscale colors for step >= 72 when noGreyscale is false', () => {
      const color72 = getNextContrastColor(72);
      expect(color72.hsl.h).toBe(0);
      expect(color72.hsl.s).toBe(0);
      expect(color72.hsl.l).toBe(50);
      expect(color72.hslString).toBe('hsl(0, 0%, 50%)');
    });

    test('should cycle through greyscale lightness values', () => {
      const expectedGreyLightness = [50, 30, 70, 10, 90];
      
      for (let i = 0; i < 5; i++) {
        const color = getNextContrastColor(72 + i);
        expect(color.hsl.h).toBe(0);
        expect(color.hsl.s).toBe(0);
        expect(color.hsl.l).toBe(expectedGreyLightness[i]);
      }
    });

    test('should repeat greyscale pattern for higher steps', () => {
      const color72 = getNextContrastColor(72);
      const color77 = getNextContrastColor(77); // 72 + 5
      
      expect(color72.hsl).toEqual(color77.hsl);
    });
  });

  describe('hOffset option', () => {
    test('should apply positive hue offset', () => {
      const colorNoOffset = getNextContrastColor(0);
      const colorWithOffset = getNextContrastColor(0, { hOffset: 30 });
      
      expect(colorWithOffset.hsl.h).toBe((colorNoOffset.hsl.h + 30) % 360);
    });

    test('should apply negative hue offset', () => {
      const colorWithNegativeOffset = getNextContrastColor(0, { hOffset: -30 });
      expect(colorWithNegativeOffset.hsl.h).toBe(330); // (0 - 30 + 360) % 360
    });

    test('should handle hue offset greater than 360', () => {
      const colorWithLargeOffset = getNextContrastColor(0, { hOffset: 390 });
      expect(colorWithLargeOffset.hsl.h).toBe(30); // 390 % 360
    });

    test('should normalize negative offsets correctly', () => {
      const colorWithNegativeOffset = getNextContrastColor(0, { hOffset: -390 });
      expect(colorWithNegativeOffset.hsl.h).toBe(330); // (-390 + 720) % 360
    });
  });

  describe('noGreyscale option', () => {
    test('should skip greyscale when noGreyscale is true', () => {
      const color72NoGrey = getNextContrastColor(72, { noGreyscale: true });
      const color0 = getNextContrastColor(0);
      
      // Should be same as step 0 since it cycles back
      expect(color72NoGrey.hsl.h).toBe(color0.hsl.h);
      expect(color72NoGrey.hsl.s).not.toBe(0); // Should not be greyscale
    });

    test('should continue color cycling when noGreyscale is true', () => {
      const color73NoGrey = getNextContrastColor(73, { noGreyscale: true });
      const color1 = getNextContrastColor(1);
      
      // Should be same as step 1
      expect(color73NoGrey.hsl).toEqual(color1.hsl);
    });
  });

  describe('combined options', () => {
    test('should apply both hOffset and noGreyscale correctly', () => {
      const color = getNextContrastColor(72, { hOffset: 60, noGreyscale: true });
      const expectedColor = getNextContrastColor(0, { hOffset: 60 });
      
      expect(color.hsl).toEqual(expectedColor.hsl);
    });
  });

  describe('color string formatting', () => {
    test('should format HSL string correctly', () => {
      const color = getNextContrastColor(0, { hOffset: 45 });
      expect(color.hslString).toBe(`hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`);
    });

    test('should handle zero values in HSL string', () => {
      const color = getNextContrastColor(72);
      expect(color.hslString).toBe('hsl(0, 0%, 50%)');
    });
  });
});

describe('getContrastColors', () => {
  test('should return empty array for count 0', () => {
    const colors = getContrastColors(0);
    expect(colors).toEqual([]);
  });

  test('should return single color for count 1', () => {
    const colors = getContrastColors(1);
    expect(colors).toHaveLength(1);
    expect(colors[0]).toEqual(getNextContrastColor(0));
  });

  test('should return correct number of colors', () => {
    const colors = getContrastColors(5);
    expect(colors).toHaveLength(5);
  });

  test('should return sequential colors', () => {
    const colors = getContrastColors(3);
    
    for (let i = 0; i < 3; i++) {
      expect(colors[i]).toEqual(getNextContrastColor(i));
    }
  });

  test('should pass options to individual color generation', () => {
    const colors = getContrastColors(2, { hOffset: 30 });
    
    expect(colors[0]).toEqual(getNextContrastColor(0, { hOffset: 30 }));
    expect(colors[1]).toEqual(getNextContrastColor(1, { hOffset: 30 }));
  });

  test('should handle large counts', () => {
    const colors = getContrastColors(100);
    expect(colors).toHaveLength(100);
    
    // Test that it includes greyscale colors
    const color72 = colors[72];
    expect(color72?.hsl.s).toBe(0); // Should be greyscale
  });

  test('should work with noGreyscale option', () => {
    const colors = getContrastColors(75, { noGreyscale: true });
    
    // Check that no colors are greyscale
    colors.forEach(color => {
      expect(color.hsl.s).toBeGreaterThan(0);
    });
  });

  describe('edge cases', () => {
    test('should handle negative count gracefully', () => {
      const colors = getContrastColors(-1);
      expect(colors).toEqual([]);
    });

    test('should work with undefined options', () => {
      const colors = getContrastColors(3, undefined);
      expect(colors).toHaveLength(3);
    });

    test('should work with partial options', () => {
      const colors = getContrastColors(2, { hOffset: 45 });
      expect(colors).toHaveLength(2);
      expect(colors[0]?.hsl?.h).toBe(45);
    });
  });
});