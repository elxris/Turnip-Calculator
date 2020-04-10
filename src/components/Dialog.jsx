import React from "react";
import { func, bool } from "prop-types";
import {
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Box,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { Button, ClearButton } from "./Button";
import { any } from "prop-types";

const useDialogStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.bkgs.main,
    borderRadius: theme.shape.borderRadius * 4,
    [theme.breakpoints.down("xs")]: {
      width: "100% !important",
      margin: 0,
    },
  },
}));

const CustomDialog = ({
  open,
  onClose,
  title,
  description,
  children,
  actions,
  ...props
}) => {
  const dialogClasses = useDialogStyles();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      classes={dialogClasses}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      {...props}
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}
      <DialogContent>
        {description && (
          <DialogContentText id="alert-dialog-description">
            {description}
          </DialogContentText>
        )}
        {children}
      </DialogContent>
      {actions && <DialogActions>{actions}</DialogActions>}
    </Dialog>
  );
};

CustomDialog.propTypes = {
  open: bool.isRequired,
  onClose: func,
  title: any,
  description: any,
  children: any,
  actions: any,
};

CustomDialog.defaults = {
  onClose: null,
  children: null,
  actions: null,
  title: null,
  description: null,
};

const ClearDataDialog = ({ open, dismiss, confirm }) => {
  const { t } = useTranslation();
  return (
    <CustomDialog
      open={open}
      onClose={dismiss}
      title={t("clearDataTitle")}
      description={t("clearDataWarning")}
      actions={
        <>
          <Button onClick={dismiss} variant="text">
            {t("cancel")}
          </Button>
          <ClearButton onClick={confirm} />
        </>
      }
    />
  );
};

ClearDataDialog.propTypes = {
  open: bool.isRequired,
  dismiss: func.isRequired,
  confirm: func.isRequired,
};

const ShareDialog = ({ chart, ...props }) => {
  return (
    <CustomDialog maxWidth="md" fullWidth {...props}>
      {open && <Box>{chart}</Box>}
    </CustomDialog>
  );
};

ShareDialog.propTypes = {
  open: bool.isRequired,
  chart: any,
};

ShareDialog.defaults = {
  chart: null,
};

export { CustomDialog as Dialog, ClearDataDialog, ShareDialog };
