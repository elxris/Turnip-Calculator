import React from "react";
import { func, bool } from "prop-types";
import {
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Button, ClearButton } from "./Button";

const useDialogStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.bkgs.main,
    borderRadius: theme.shape.borderRadius * 4,
  },
}));

const ClearDataDialog = ({ open, dismiss, confirm }) => {
  const { t } = useTranslation();
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
        <Button onClick={dismiss} variant="text">
          {t("cancel")}
        </Button>
        <ClearButton onClick={confirm} />
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
