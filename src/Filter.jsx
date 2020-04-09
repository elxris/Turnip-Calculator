import React, { useCallback, useState } from "react";
import { arrayOf, string, func } from "prop-types";
import {
  TextField,
  FormGroup,
  InputAdornment,
  Button,
  Box,
  makeStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";
import { useTranslation } from "react-i18next";
import bells from "./images/bells.svg";

const useButtonStyles = makeStyles((theme) => ({
  root: {
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

const ClearDataDialog = ({ open, dismiss, confirm }) => {
  const { t } = useTranslation();

  return (
    <Dialog
      open={open}
      onClose={dismiss}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {t("clearDataTitle")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {t("clearDataWarning")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={dismiss} color="default">
          {t("cancel")}
        </Button>
        <Button onClick={confirm} color="default" autoFocus>
          {t("Clear All Data!")}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const names = [
  i18n.t("Buy Price"),
  ...i18n
    .t("Mon Tue Wed Thu Fri Sat")
    .split(" ")
    .reduce(
      (curr, day) => [
        ...curr,
        ...[`${day} ${i18n.t("AM")}`, `${day} ${i18n.t("PM")}`],
      ],
      []
    ),
];

const Filter = ({ filters, onChange }) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  const handleChange = useCallback(
    (index) => ({
      target: {
        value,
        validity: { valid },
      },
    }) => {
      if (!valid) return;
      const newFilters = Array.from({ length: 13 }, (v, i) =>
        index === i ? value : filters[i]
      );
      onChange(newFilters);
    },
    [filters, onChange]
  );

  const names = [
    t("Buy Price"),
    ...t("Mon Tue Wed Thu Fri Sat")
      .split(" ")
      .reduce(
        (curr, day) => [...curr, ...[`${day} ${t("AM")}`, `${day} ${t("PM")}`]],
        []
      ),
  ];

  const fields = Array.from({ length: 13 }, (v, i) => i).map((index) => (
    <TextField
      key={`value-${index}`}
      type="tel"
      variant="standard"
      color="secondary"
      label={names[index]}
      fullWidth
      inputProps={{ pattern: "[0-9]*" }}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <img src={bells} alt="A picture of a bag of bells" />
          </InputAdornment>
        ),
      }}
      value={filters[index] || ""}
      onChange={handleChange(index)}
    />
  ));

  return (
    <Box
      borderRadius={16}
      bgcolor="primary.light"
      display="flex"
      flexDirection="column"
    >
      <ClearDataDialog
        open={open}
        dismiss={() => setOpen(false)}
        confirm={() => {
          setOpen(false);
          onChange([]);
        }}
      />
      <FormGroup>
        <Box
          m={2}
          p={2}
          mb={-1}
          borderRadius={16}
          bgcolor="bkgs.mainAlt"
          display="flex"
        >
          {fields[0]}
        </Box>
        <Box m={2} ml={1} mr={1} display="flex" flexWrap="wrap">
          {fields.slice(1).reduce(
            (prev, curr, index) =>
              index % 2
                ? [
                    ...prev.slice(0, -1),
                    <Box
                      key={index}
                      p={1}
                      width={{ xs: 0.5, sm: 1 / 3, md: 1 / 6 }}
                    >
                      <Box p={2} bgcolor="bkgs.mainAlt" borderRadius={16}>
                        <Box m={1}>{prev.slice(-1)}</Box>
                        <Box m={1}>{curr}</Box>
                      </Box>
                    </Box>,
                  ]
                : [...prev, curr],
            []
          )}
        </Box>
      </FormGroup>
      <Box alignSelf="flex-end" mt={-2}>
        <ClearButton onClick={() => setOpen(true)} />
      </Box>
    </Box>
  );
};

Filter.propTypes = {
  filters: arrayOf(string).isRequired,
  onChange: func.isRequired,
};

export default Filter;
