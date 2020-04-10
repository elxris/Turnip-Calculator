import { createMuiTheme } from "@material-ui/core";
import finkWoff1 from "../fonts/FinkHeavyRegular.woff";
import finkWoff2 from "../fonts/FinkHeavyRegular.woff2";
import arialRoundWoff from "../fonts/ArialRoundedBold.woff";

const finkHeavy = {
  fontFamily: "FinkHeavy",
  src: ` 
    url(${finkWoff2}) format('woff2'),
    url(${finkWoff1}) format('woff')
    `,
  fontWeight: "normal",
  fontStyle: "normal",
};

const arialRound = {
  fontFamily: "Arial Rounded MT Bold",
  fontStyle: "normal",
  fontWeight: "normal",
  src: `
    local('Arial Rounded MT Bold'),
    url(${arialRoundWoff}) format('woff')
    `,
};

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#7FD1A5",
      dark: "#007D75",
      light: "#88C9A1",
    },
    secondary: {
      light: "#7B6C53",
      main: "#6B5C43",
    },
    bkgs: {
      main: "#E9F5EB",
      mainAlt: "#F8F8F0",
      chart: "#D8F1E1",
      banner: "#F0FFF5",
      content: "#88C9A1",
      contentAlt: "#7B6C53",
    },
    warning: {
      main: "#F1E26F",
      dark: "#EF8341",
    },
    text: {
      primary: "#6E661B",
    },
  },
  typography: {
    fontFamily: [
      '"Arial Rounded MT Bold"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
    ],
    ...Array.from({ length: 6 }, (v, i) => i + 1).reduce(
      (prev, v) => ({
        ...prev,
        [`h${v}`]: {
          fontFamily: [
            "FinkHeavy",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
          ],
        },
      }),
      {}
    ),
  },
  overrides: {
    MuiCssBaseline: {
      "@global": {
        "@font-face": [finkHeavy, arialRound],
      },
    },
  },
});

export default theme;
