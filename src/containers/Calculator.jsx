import React from "react";
import PropTypes from "prop-types";
import { useFilters, useShare, useCalculation } from "../utils";
import { Filter, TabPanel } from "../containers";
import { ShareDialog, Chart, Table } from "../components";

const Calculator = ({ value, index, filterKey }) => {
  const { inputFilters, filters, saveFilters } = useFilters(filterKey);
  const {
    onCloseShareModal,
    showShareDialog,
    openShareDialog,
    shareFilters,
  } = useShare(filters);
  const result = useCalculation({ filters });

  return (
    <TabPanel value={value} index={index}>
      <Filter
        filters={inputFilters}
        onChange={saveFilters}
        openShareDialog={openShareDialog}
      />
      <Chart {...result} />
      <Table {...result} />
      <ShareDialog
        open={showShareDialog}
        filters={shareFilters}
        onClose={onCloseShareModal}
      />
    </TabPanel>
  );
};

Calculator.propTypes = {
  value: PropTypes.number.isRequired,
  index: PropTypes.number.isRequired,
  filterKey: PropTypes.string.isRequired,
};

export default Calculator;
