/**
 * Representation of color in HSL (hue, saturation, luminance) format.
 */
export interface HslColor {
    h: number;
    s: number;
    l: number;
}

/**
 * Converts hex color string to hsl object
 * @param color color string in hex representation
 */
export function hexToHsl(color: string): HslColor {
    const red = parseInt(color.substr(1, 2), 16) / 255;
    const green = parseInt(color.substr(3, 2), 16) / 255;
    const blue = parseInt(color.substr(5, 2), 16) / 255;

    const max = Math.max(red, green, blue);
    const min = Math.min(red, green, blue);

    const delta = max - min;

    let hue;
    if (delta === 0) {
        hue = 0;
    }
    else if (max === red) {
        hue = 60 * (((green - blue) / delta) % 6);
    }
    else if (max === green) {
        hue = 60 * (((green - blue) / delta) + 2);        
    }
    else if (max === blue) {
        hue = 60 * (((green - blue) / delta) + 4);
    }

    const luminance = (max + min) / 2;
    const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * luminance - 1));

    return {h:hue, s:saturation, l:luminance};
}

/**
 * Convert HSL color object to hex string
 * @param color color object in HSL representation
 */
export function hslToHex(color: HslColor) {
    const s = color?.s / 100
    const l = color?.l / 100
    const h = color?.h


    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        Math.round(255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))));

    const r = f(0);
    const g = f(8);
    const b = f(4);

    return `#${[r, g, b]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('')}`;

}