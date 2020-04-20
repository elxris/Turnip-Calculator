import React from "react";
import { CssBaseline, ThemeProvider, Container, Box } from "@material-ui/core";
import { useFilters, useTitle, theme, useShare } from "../utils";
import { Title, Filter, Footer } from "../containers";
import { ShareDialog, Chart } from "../components";

const App = () => {
  useTitle();
  const { inputFilters, filters, saveFilters } = useFilters();
  const {
    onCloseShareModal,
    showShareDialog,
    openShareDialog,
    shareFilters,
  } = useShare(filters);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        <Title />
        <Box mx={[-1.5, 0]}>
          <Filter
            filters={inputFilters}
            onChange={saveFilters}
            openShareDialog={openShareDialog}
          />
          <Chart filters={filters} />
          <Footer />
        </Box>
      </Container>
      <ShareDialog
        open={showShareDialog}
        filters={shareFilters}
        onClose={onCloseShareModal}
      />
    </ThemeProvider>
  );
};

export default App;
