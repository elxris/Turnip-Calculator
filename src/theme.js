import { createMuiTheme } from "@material-ui/core";

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
      banner: "#F0FFF5",
      content: "#88C9A1",
      contentAlt: "#7B6C53",
    },
    warning: {
      main: "#F1E26F",
      dark: "#EF8341",
    },
    text: {
      primary: "#6B5C43",
    },
  },
  typography: {
    fontFamily: [
      '"Libre Franklin"',
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
    ],
    ...Array.from({ length: 6 }, (v, i) => i + 1).reduce(
      (prev, v) => ({
        ...prev,
        [`h${v}`]: {
          fontFamily: [
            "Zilla Slab",
            "-apple-system",
            "BlinkMacSystemFont",
            '"Segoe UI"',
          ],
        },
      }),
      {}
    ),
  },
});

export default theme;
