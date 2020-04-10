import React from "react";
import { CssBaseline, ThemeProvider, Container } from "@material-ui/core";
import { useFilters, useTitle, theme } from "../utils";
import { Title, Filter, Chart, Footer, Share } from "./";

const App = () => {
  useTitle();
  const { inputFilters, filters, saveFilters } = useFilters();

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Share filters={filters} />
        <Container maxWidth="md">
          <Title />
          <Filter filters={inputFilters} onChange={saveFilters} />
          <Chart filter={filters} />
          <Footer />
        </Container>
      </ThemeProvider>
    </>
  );
};

export default App;
