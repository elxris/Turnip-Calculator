import React from "react";
import { CssBaseline, ThemeProvider, Container, Box } from "@material-ui/core";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import {
  useTitle,
  useTabs,
  theme,
} from "../utils";
import { Title, Footer, IslandTabs, Calculator } from "../containers";

const App = () => {
  useTitle();
  const {tabs, addTab, deleteTab, value, handleTabChange} = useTabs();

  const panelMarkup = tabs.map((tab, index) => (
    <Calculator filterKey={tab.key} key={tab.key} value={value} index={index} />
  ));

  return (
    <ThemeProvider theme={theme}>
      <StyledComponentsThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Title />
          <Box mx={[-1.5, 0]}>
          <IslandTabs
            tabs={tabs}
            value={value}
            onAdd={addTab}
            onDelete={deleteTab}
            onChange={handleTabChange}
          />
          {panelMarkup}
          <Footer />
        </Box>
        </Container>
      </StyledComponentsThemeProvider>
    </ThemeProvider>
  );
};

export default App;
