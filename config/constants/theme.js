import {  Dimensions,  } from 'react-native';
const { width, height } = Dimensions.get("window");

export const COLORS = {
    primary: "#4B5563",
    secondary: "#10B981",

    green: {
        400: "#34D399",
        500: "#10B981"
    },
    blue: {
        400: "#60A5FA",
        500: "#3B82F6"
    },
    yellow: {
        400: "#FBBF24",
        500: "#F59E0B"
    },
    red: {
        400: "#F87171",
        500: "#EF4444"
    },

    gray: {
        400: "#9CA3AF",
        500: "#6B7280",
        700: "#374151",
        900: "#111827"
    }
}

export const SIZES = {
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,

    // font sizes
    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,
    body1: 30,
    body2: 22,
    body3: 16,
    body4: 14,
    body5: 12,

    // dimensions
    width,
    height
}

export const FONTS = {
    brand: { fontFamily: "Roboto-Black", fontSize: SIZES.h1, lineHeight: 36 },
    h1: { fontFamily: "Roboto-Black", fontSize: SIZES.h1, lineHeight: 36 },
    h2: { fontFamily: "Roboto-Bold", fontSize: SIZES.h1, lineHeight: 30 },
    h3: { fontFamily: "Roboto-Bold", fontSize: SIZES.h1, lineHeight: 22 },
    h4: { fontFamily: "Roboto-Bold", fontSize: SIZES.h1, lineHeight: 22 },
    body1: { fontFamily: "Roboto-Regular", fontSize: SIZES.body1, lineHeight: 30 },
    body2: { fontFamily: "Roboto-Regular", fontSize: SIZES.body2, lineHeight: 22 },
    body3: { fontFamily: "Roboto-Regular", fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontFamily: "Roboto-Regular", fontSize: SIZES.body4, lineHeight: 16 },
    body4: { fontFamily: "Roboto-Regular", fontSize: SIZES.body5, lineHeight: 14 }
}

export const SHADOWS = {
    shadow1: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 3,
        },
        shadowOpacity: 0.29,
        shadowRadius: 4.65,
    }
}

const appTheme = { COLORS, SIZES, FONTS, SHADOWS }
export default appTheme