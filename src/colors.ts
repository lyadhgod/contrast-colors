interface Options {
    hOffset?: number;
    noGreyscale?: boolean;
}

interface Color {
    hsl: { h: number; s: number; l: number; };
    hslString: string
}

/**
 * Default options for contrast color generation.
 * - `hOffset`: The hue offset in degrees applied to all generated colors (default: 0).
 * - `noGreyscale`: If true, disables greyscale colors for steps >= 72 (default: false).
 */
const defaultOptions: Required<Options> = {
    hOffset: 0,
    noGreyscale: false
};

/**
 * Generates a visually distinct color in HSL format based on the provided step index.
 * The function cycles through hues, lightness, and saturation to maximize contrast between colors.
 * Optionally, it can include greyscale colors after a certain step or apply a hue offset.
 *
 * @param step - The index of the color to generate. Negative values return the default grey color.
 * @param options - Configuration options for color generation:
 *   - `hOffset`: Optional hue offset in degrees to shift all generated colors.
 *   - `noGreyscale`: If true, disables greyscale colors for steps >= 72 and repeats from start.
 * @returns A `Color` object containing the HSL values and a CSS-compatible HSL string.
 */
function getNextContrastColor(step: number, options: Options = defaultOptions) {
    // Default to grey
    const color: Color = {
        hsl: { h: 0, s: 0, l: 50 },
        hslString: 'hsl(0, 0%, 50%)'
    };

    // Return default color if step is negative
    if (step < 0) return color;

    // Return grey scale if step is 72 or more
    if (!options.noGreyscale && step >= 72) {
        step -= 72;

        const lResidue = step % 5;
        let l = 50;
        switch (lResidue) {
            case 0: l = 50; break;
            case 1: l = 30; break;
            case 2: l = 70; break;
            case 3: l = 10; break;
            case 4: l = 90; break;
        }

        color.hsl.l = l;
        color.hslString = `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;
        
        return color;
    }   

    // Select hue
    const hResidue = step % 12;
    let h = 0;
    switch (hResidue) {
        case 0: h = 0; break;
        case 1: h = 120; break;
        case 2: h = 240; break;
        case 3: h = 180; break;
        case 4: h = 300; break;
        case 5: h = 60; break;
        case 6: h = 270; break;
        case 7: h = 150; break;
        case 8: h = 30; break;
        case 9: h = 210; break;
        case 10: h = 330; break;
        case 11: h = 90; break;
    }
    let normalizedHOffset = (options.hOffset ?? defaultOptions.hOffset) % 360;
    if (normalizedHOffset < 0) normalizedHOffset += 360;
    h = (h + normalizedHOffset) % 360;

    // Select lightness
    const hStep = Math.trunc(step / 12);
    const lResidue = hStep % 3;
    let l = 50;
    switch (lResidue) {
        case 0: l = 50; break;
        case 1: l = 32; break;
        case 2: l = 63; break;
    }

    // Select saturation
    const lStep = Math.trunc(hStep / 3);
    const sResidue = lStep % 2;
    let s = 100;
    switch (sResidue) {
        case 0: s = 100; break;
        case 1: s = 50; break;
    }

    color.hsl.h = h;
    color.hsl.s = s;
    color.hsl.l = l;
    color.hslString = `hsl(${color.hsl.h}, ${color.hsl.s}%, ${color.hsl.l}%)`;

    return color;
}


/**
 * Generates an array of visually distinct colors for contrast purposes.
 *
 * @param count - The number of contrast colors to generate.
 * @param options - Optional configuration for color generation. Defaults to `defaultOptions`.
 * @returns An array of `Color` objects representing the generated contrast colors.
 */
function getContrastColors(count: number, options: Options = defaultOptions) {
    const colors: Color[] = [];
    for (let i = 0; i < count; i++) {
        colors.push(getNextContrastColor(i, options));
    }
    return colors;
}

export {
    getNextContrastColor,
    getContrastColors
};
