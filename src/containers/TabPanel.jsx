import React from "react";
import { any, number } from "prop-types";
import { useFilters, useShare, useCalculation } from "../utils";
import { Filter } from "../containers";
import { ShareDialog, Chart, Table } from "../components";

const TabPanel = ({ value, index, filterKey, ...other }) => {
  const { inputFilters, filters, saveFilters } = useFilters(filterKey);
  const {
    onCloseShareModal,
    showShareDialog,
    openShareDialog,
    shareFilters,
  } = useShare(filters);

  const result = useCalculation({ filters });

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      {...other}
    >
      {value === index && (
        <>
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
        </>
      )}
    </div>
  );
};

TabPanel.propTypes = {
  value: number.isRequired,
  index: number.isRequired,
  filterKey: any.isRequired,
};

export default TabPanel;
