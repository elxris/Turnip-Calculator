import React from "react";
import { Button, makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const useButtonStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.shape.borderRadius * 4,
    backgroundColor: theme.palette.warning.main,
    "&:hover": {
      backgroundColor: theme.palette.warning.dark,
    },
  },
  label: {
    textTransform: "capitalize",
  },
}));

const ClearButton = (props) => {
  const { t } = useTranslation();
  const classes = useButtonStyles();
  return (
    <Button
      classes={classes}
      disableRipple
      size="small"
      variant="contained"
      {...props}
    >
      {t("Clear All Data!")}
    </Button>
  );
};

export { useButtonStyles, ClearButton };
