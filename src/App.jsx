import React, { useEffect, useMemo } from "react";
import { useLocalStorage } from "react-use";
import { CssBaseline, ThemeProvider, Container } from "@material-ui/core";
import theme from "./theme";
import Filter from "./Filter";
import Calculator from "./Calculator";
import Chart from "./Chart";
import Title from "./Title";
import Footer from "./Footer";

const App = () => {
  const [filters, onChange] = useLocalStorage("filters", []);

  const sanitizedInputFilters = useMemo(
    () =>
      Array.from({ length: 13 }).map((v, i) =>
        String(Number(filters[i]) || "")
      ),
    [filters]
  );

  const sanitizedFilters = useMemo(
    () => filters.map((v) => Number(v) || undefined),
    [filters]
  );

  useEffect(() => {
    if (!Array.isArray(filters)) {
      onChange([]);
    }
  }, [filters]);

  // Avoid errors
  if (!Array.isArray(filters)) return null;

  return (
    <>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Container maxWidth="md">
          <Title />
          <Filter filters={sanitizedInputFilters} onChange={onChange} />
          {false && <Calculator filter={sanitizedFilters} />}
          <Chart filter={sanitizedFilters} />
          <Footer />
        </Container>
      </ThemeProvider>
    </>
  );
};

export default App;
