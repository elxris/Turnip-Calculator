import React from "react";
import { Typography, Box } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const Title = () => {
  const { t } = useTranslation();
  return (
    <Box mt={4} mb={2}>
      <Typography variant="h3" color="textPrimary">
        {t("ACNH Turnip Calculator")}
      </Typography>
    </Box>
  );
};

export default Title;
