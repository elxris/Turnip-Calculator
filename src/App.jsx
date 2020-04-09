import React from "react";
import { CssBaseline, ThemeProvider, Container } from "@material-ui/core";
import theme from "./theme";
import { useFilters, useTitle } from "./utils";
import Filter from "./Filter";
import Chart from "./Chart";
import Title from "./Title";
import Footer from "./Footer";

const App = () => {
  useTitle();
  const { inputFilters, filters, saveFilters } = useFilters();

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
