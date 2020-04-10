import React from "react";
import { useShare } from "../utils";
import { number, arrayOf } from "prop-types";

const Share = ({ filters }) => {
  const { onCloseShareModal, showShareModal, onShare, shareFilters } = useShare(
    filters
  );
  return <div></div>;
};

Share.propTypes = {
  filters: arrayOf(number),
};

export default Share;
