import {  Dimensions,  } from 'react-native';
const { width, height } = Dimensions.get("window");
import colors from "./colors";

export const COLORS = {
    primary: "#1B243F",
    primaryLighten: '#1b243f',
    primaryText: "#4B5563",
    secondary: "#10B981",
    bgPanelColor: "#43527c",
    green: colors.green,
    blue: colors.blue,
    yellow: colors.yellow,
    red: colors.red,

    gray: colors.gray
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
    brand: { fontFamily: "Potta_One", fontSize: SIZES.h1, lineHeight: 36 },
    h1: { fontFamily: "Roboto_900Black", fontSize: SIZES.h1, lineHeight: 36 },
    h2: { fontFamily: "Roboto_700Bold", fontSize: SIZES.h2, lineHeight: 30 },
    h3: { fontFamily: "Roboto_700Bold", fontSize: SIZES.h3, lineHeight: 22 },
    h4: { fontFamily: "Roboto_700Bold", fontSize: SIZES.h4, lineHeight: 22 },
    body1: { fontFamily: "Roboto_400Regular", fontSize: SIZES.body1, lineHeight: 30 },
    body2: { fontFamily: "Roboto_400Regular", fontSize: SIZES.body2, lineHeight: 22 },
    body3: { fontFamily: "Roboto_400Regular", fontSize: SIZES.body3, lineHeight: 22 },
    body4: { fontFamily: "Roboto_400Regular", fontSize: SIZES.body4, lineHeight: 16 },
    body5: { fontFamily: "Roboto_400Regular", fontSize: SIZES.body5, lineHeight: 14 }
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