import React from "react";
import { CssBaseline, ThemeProvider, Container, Box } from "@material-ui/core";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import {
  useFilters,
  useTitle,
  theme,
  useShare,
  useTimeTravel,
  useWeekDays,
} from "../utils";
import { Title, Filter, Footer } from "../containers";
import { ShareDialog, Table, Dropdown, Chart } from "../components";

const App = () => {
  useTitle();
  const { inputFilters, filters, saveFilters } = useFilters();
  const {
    onCloseShareModal,
    showShareDialog,
    openShareDialog,
    shareFilters,
  } = useShare(filters);

  const [, dispatch, result] = useTimeTravel(filters);
  const { weekDaysCombined } = useWeekDays();

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
            <Box p={[0.5, 1, 2]} mt={2} display="flex" alignItems="center">
              <Dropdown
                label="Rewind the chart's prediction to:"
                labelId="rewind-label"
                selectId="rewind-select"
                menuItems={weekDaysCombined.map((weekday, idx) => ({
                  text: weekday,
                  value: idx + 1, // The days/times start at index 1 in the "filters" array
                }))}
                onChange={(e) => {
                  const { value } = e.target;
                  dispatch({
                    payload: {
                      rewindEnabled: typeof value === "number",
                      indexInHistory: value,
                      filters,
                    },
                  });
                }}
              />
            </Box>
            <Chart {...result} />
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
