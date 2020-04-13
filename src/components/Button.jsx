import React from "react";
import { Button as MaterialButton, makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import cx from "classnames";
import { string } from "prop-types";

const useButtonStyles = makeStyles((theme) => ({
  root: {
    borderRadius: theme.shape.borderRadius * 4,
    "&.yellow": {
      backgroundColor: theme.palette.warning.main,
      "&:hover": {
        backgroundColor: theme.palette.warning.dark,
      },
    },
  },
  label: {
    textTransform: "capitalize",
  },
}));

const Button = ({ className, bgcolor, ...props }) => {
  const classes = useButtonStyles();

  return (
    <MaterialButton
      classes={classes}
      className={cx(className, bgcolor)}
      disableRipple
      size="small"
      variant="contained"
      {...props}
    />
  );
};

Button.propTypes = {
  bgcolor: string,
  className: string,
};

Button.defaults = {
  bgcolor: "",
  className: "",
};

const ClearButton = (props) => {
  const { t } = useTranslation();
  return (
    <Button bgcolor="yellow" {...props}>
      {t("Clear All Data!")}
    </Button>
  );
};

export { useButtonStyles, Button, ClearButton };
