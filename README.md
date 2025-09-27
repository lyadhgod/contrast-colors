# contrast-colors

A TypeScript library for working with contrast colors. The library provides utility functions to generate colors with high contrast to be used as labels, texts, etc.

## Features
- Generate colors with high contrast
- Outputs colors in various formats having CSS compatibility and also any other custom requirement
- Utility functions for generating colors as a generator

## Installation

```sh
npm install contrast-colors
```

## Usage

### Generate n high constrast colors in a predictable way

```typescript
import { getContrastColors } from 'contrast-colors';

const colors = getContrastColors(3);
console.log(colors); // [
//  { hsl: { h: 0, s: 100, l: 50 }, hslString: 'hsl(0, 100%, 50%)' },
//  { hsl: { h: 120, s: 100, l: 50 }, hslString: 'hsl(120, 100%, 50%)' },
//  { hsl: { h: 240, s: 100, l: 50 }, hslString: 'hsl(240, 100%, 50%)' }
// ]
```

### Generate single nth step color as a generator function

```typescript
import { getNextContrastColor } from 'contrast-colors';

const nthColor = getNextContrastColor(23);
console.log(nthColor); // { hsl: { h: 90, s: 100, l: 32 }, hslString: 'hsl(90, 100%, 32%)' }
```

## API

### `getContrastColors(count: number, options?: Options): Color[]`
Generates an array of visually distinct colors for contrast purposes.

### `getNextContrastColor(step: number, options?: Options): Color`
Generates a visually distinct color based on the provided step index.
