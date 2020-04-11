import React from "react";
import { CssBaseline, ThemeProvider, Container } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useFilters, useTitle, theme, useShare } from "../utils";
import { Title, Filter, Chart, Footer } from "./";
import { Button, ShareDialog } from "../components";

const App = () => {
  useTitle();
  const { t } = useTranslation();
  const { inputFilters, filters, saveFilters } = useFilters();
  const {
    onCloseShareModal,
    showShareDialog,
    openShareDialog,
    shareFilters,
  } = useShare(filters);

  return (
    <>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ShareDialog
          open={showShareDialog}
          chart={<Chart filter={shareFilters} />}
          description={t("shareDialog")}
          actions={
            <>
              <Button onClick={onCloseShareModal}>{t("closeButton")}</Button>
            </>
          }
        />
        <Container maxWidth="md">
          <Title />
          <Filter
            filters={inputFilters}
            onChange={saveFilters}
            openShareDialog={openShareDialog}
          />
          <Chart filter={filters} />
          <Footer />
        </Container>
      </ThemeProvider>
    </>
  );
};

export default App;
