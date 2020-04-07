import React from "react";
import { Typography, Box } from "@material-ui/core";
import i18n from "./i18n";

const Title = () => {
  return (
    <Box mt={4} mb={2}>
      <Typography variant="h3" color="textPrimary">
        {i18n.t("ACNH Turnip Calculator")}
      </Typography>
    </Box>
  );
};

export default Title;
