import React from "react";
import { useTranslation } from "react-i18next";
import { node } from "prop-types";
import { CssBaseline, ThemeProvider } from "@material-ui/core";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import { BrowserRouter } from "react-router-dom";
import { useTheme } from "../utils";
import { QuantileProvider } from "../components";
import "../i18n";

const Providers = ({ children }) => {
  const { i18n } = useTranslation();
  const theme = useTheme({ language: i18n.language });

  return (
    <React.StrictMode>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <StyledComponentsThemeProvider theme={theme}>
            <QuantileProvider>
              <CssBaseline />
              {children}
            </QuantileProvider>
          </StyledComponentsThemeProvider>
        </ThemeProvider>
      </BrowserRouter>
    </React.StrictMode>
  );
};
Providers.propTypes = {
  children: node.isRequired,
};

export default Providers;
