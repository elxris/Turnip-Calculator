import React from "react";
import { Container, Box } from "@material-ui/core";
import { useFilters, useTitle, useShare, useCalculation } from "../utils";
import { Title, Filter, Footer } from "../containers";
import { ShareDialog, Chart, Table } from "../components";

const App = () => {
  useTitle();
  const { inputFilters, filters, saveFilters } = useFilters();
  const {
    onCloseShareModal,
    showShareDialog,
    openShareDialog,
    shareFilters,
  } = useShare(filters);

  const result = useCalculation({ filters });

  return (
    <>
      <Container maxWidth="md">
        <Title />
        <Box mx={[-1.5, 0]}>
          <Filter
            filters={inputFilters}
            onChange={saveFilters}
            openShareDialog={openShareDialog}
          />
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
    </>
  );
};

export default App;
