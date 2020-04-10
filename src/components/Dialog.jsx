import React from "react";
import { func, bool } from "prop-types";
import {
  Button,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useButtonStyles } from "./";

const useDialogStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.bkgs.main,
    borderRadius: theme.shape.borderRadius * 4,
  },
}));

const ClearDataDialog = ({ open, dismiss, confirm }) => {
  const { t } = useTranslation();
  const buttonClasses = useButtonStyles();
  const dialogClasses = useDialogStyles();

  return (
    <Dialog
      open={open}
      onClose={dismiss}
      classes={dialogClasses}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{t("clearDataTitle")}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t("clearDataWarning")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={dismiss} color="default">
          {t("cancel")}
        </Button>
        <Button
          classes={buttonClasses}
          onClick={confirm}
          color="default"
          variant="contained"
          autoFocus
        >
          {t("Clear All Data!")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

ClearDataDialog.propTypes = {
  open: bool.isRequired,
  dismiss: func.isRequired,
  confirm: func.isRequired,
};

export { ClearDataDialog };
