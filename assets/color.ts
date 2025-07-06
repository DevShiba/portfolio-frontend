interface ColorVariant {
  dark: Array<number>;
  light: Array<number>;
}

interface ColorPalette {
  color1: ColorVariant;
  color2: ColorVariant;
  color3: ColorVariant;
}

export const WhiteBrownOrange: ColorPalette = {
  color1: {
    dark: [3, 3, 3], 
    light: [247, 247, 247], 
  },
  color2: {
    dark: [231, 87, 16],
    light: [255, 140, 70], 
  },
  color3: {
    dark: [255, 230, 237],
    light: [160, 120, 90], 
  },
};
