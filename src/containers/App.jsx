import React from "react";
import { CssBaseline, ThemeProvider, Container, Box } from "@material-ui/core";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import {
  useFilters,
  useTitle,
  theme,
  useShare,
  useCalculation,
  useChartReducer,
} from "../utils";
import { Title, Filter, Footer } from "../containers";
import { ShareDialog, Table, Dropdown, StatefulChart } from "../components";

const App = () => {
  useTitle();
  const { inputFilters, filters, saveFilters } = useFilters();
  const {
    onCloseShareModal,
    showShareDialog,
    openShareDialog,
    shareFilters,
  } = useShare(filters);

  const [state] = useChartReducer();
  const { rewindEnabled, rewindFilters } = state;

  // Get prediction/minMax values based on rewindFilters
  // if rewindEnabled is true
  let result = useCalculation({
    filters: rewindEnabled ? rewindFilters : filters,
  });
  if (rewindEnabled) {
    // Draw "Daily Price" based on the user's actual input.
    // This allows the user to see their actual turnip prices graphed
    // compared to past projections as they evolved.
    result.filters = filters;
  }

  return (
    <ThemeProvider theme={theme}>
      <StyledComponentsThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Title />
          <Box mx={[-1.5, 0]}>
            <Filter
              filters={inputFilters}
              onChange={saveFilters}
              openShareDialog={openShareDialog}
            />
            <Dropdown menuItems={[{ text: "Test" }]} />
            <StatefulChart {...result} state={state} />
            <Table {...result} />
            <Footer />
          </Box>
        </Container>
        <ShareDialog
          open={showShareDialog}
          filters={shareFilters}
          onClose={onCloseShareModal}
        />
      </StyledComponentsThemeProvider>
    </ThemeProvider>
  );
};

export default App;
