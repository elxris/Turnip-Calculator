import React, { useCallback, useState } from "react";
import { arrayOf, string, func } from "prop-types";
import { TextField, FormGroup, InputAdornment, Box } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { ClearButton, ClearDataDialog, Button } from "../components";
import {} from "../utils";
import bells from "../images/bells.svg";

const Filter = ({ filters, onChange, openShareDialog }) => {
  const [clearDataDialogOpen, setClearDataDialogOpen] = useState(false);
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
      inputProps={{ pattern: "[0-9]*", tabIndex: 0 }}
      InputLabelProps={{ shrink: true }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <img src={bells} alt="Bag of bells" />
          </InputAdornment>
        ),
      }}
      value={filters[index] || ""}
      onChange={handleChange(index)}
    />
  ));

  return (
    <>
      <ClearDataDialog
        open={clearDataDialogOpen}
        dismiss={() => setClearDataDialogOpen(false)}
        confirm={() => {
          setClearDataDialogOpen(false);
          onChange([]);
        }}
      />
      <Box
        borderRadius={16}
        bgcolor="primary.light"
        display="flex"
        flexDirection="column"
      >
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
        <Box alignSelf="flex-end" mt={-2} display="flex">
          <Box mx={1}>
            <Button onClick={openShareDialog}>{t("shareButton")}</Button>
          </Box>
          <ClearButton onClick={() => setClearDataDialogOpen(true)} />
        </Box>
      </Box>
    </>
  );
};

Filter.propTypes = {
  filters: arrayOf(string).isRequired,
  onChange: func.isRequired,
  openShareDialog: func.isRequired,
};

export default Filter;
