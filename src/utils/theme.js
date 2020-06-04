import { createMuiTheme } from "@material-ui/core";
import FinkHeavyRegular from "../fonts/FinkHeavyRegular.woff";
import FinkHeavyRegular2 from "../fonts/FinkHeavyRegular.woff2";
import ArialRoundedBold from "../fonts/ArialRoundedBold.woff";

const finkHeavy = {
  fontFamily: "FinkHeavy",
  src: ` 
    url(${FinkHeavyRegular2}) format('woff2'),
    url(${FinkHeavyRegular}) format('woff')
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
    url(${ArialRoundedBold}) format('woff')
    `,
};

const useTheme = ({ language }) =>
  createMuiTheme({
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
        table: "#cde4f2",
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
      fontFamily: ["ro", "pl"].includes(language) // Română and Polski needs separate fonts
        ? ["Arial", "Helvetica Neue", "Helvetica", "sans-serif"]
        : [
            '"Arial Rounded MT Bold"',
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
          ],
      ...Array.from({ length: 6 }, (v, i) => i + 1).reduce(
        (prev, v) => ({
          ...prev,
          [`h${v}`]: {
            fontFamily: ["ro", "pl"].includes(language)
              ? ["Arial", "Helvetica Neue", "Helvetica", "sans-serif"]
              : [
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
          body: {
            wordBreak: ["ko"].includes(language) ? "keep-all" : "initial",
            paddingTop: "env(safe-area-inset-top)",
            paddingLeft: "env(safe-area-inset-left)",
            paddingRight: "env(safe-area-inset-right)",
            "-webkit-text-size-adjust": "100%",
          },
          "body::before": {
            content: "''",
            position: "fixed",
            width: "100%",
            top: "0",
            zIndex: "10",
            height: "env(safe-area-inset-top)",
            backgroundColor: "rgb(123, 108, 83)",
            borderBottom: "1px solid #E9F5EB",
          },
        },
      },
    },
  });

export default useTheme;
