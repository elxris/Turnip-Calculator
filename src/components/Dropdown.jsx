import React from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  makeStyles,
} from "@material-ui/core";
import {
  string,
  arrayOf,
  shape,
  number,
  func,
  bool,
  oneOfType,
} from "prop-types";
import { useTranslation } from "react-i18next";
import { useWeekDays } from "../utils/";

const useDropdownStyles = makeStyles({
  formControl: {
    width: "100%",
    maxWidth: "575px",
  },
});

const Dropdown = ({
  menuItems,
  onChange,
  label,
  labelId,
  selectId,
  helperText,
  disabled,
  value,
}) => (
  <FormControl className={useDropdownStyles().formControl} disabled={disabled}>
    <InputLabel id={labelId}>{label}</InputLabel>
    <Select value={value} labelId={labelId} id={selectId} onChange={onChange}>
      <MenuItem value="">
        <em>Clear Selection</em>
      </MenuItem>
      {menuItems.map((item) => {
        if (!item) return null;
        return (
          <MenuItem value={item.value} key={item.value}>
            {item.text}
          </MenuItem>
        );
      })}
    </Select>
    {helperText && <FormHelperText>{helperText}</FormHelperText>}
  </FormControl>
);

Dropdown.propTypes = {
  menuItems: arrayOf(
    shape({
      text: string,
      value: number,
    })
  ).isRequired,
  onChange: func,
  label: string,
  labelId: string,
  selectId: string,
  helperText: string,
  disabled: bool,
  value: oneOfType([number, string]),
};

Dropdown.defaults = {
  onChange: () => {},
  label: "",
  labelId: "",
  selectId: "",
  helperText: "",
  disabled: false,
  value: "",
};

export const TimeTravelDropdown = ({ filters, dispatch }) => {
  const [value, setValue] = React.useState("");
  const { weekDaysCombined } = useWeekDays();
  const { t } = useTranslation();

  return (
    <Dropdown
      value={value}
      label={t("Rewind to a day and time")}
      labelId="rewind-label"
      selectId="rewind-select"
      helperText={t(
        "Use this dropdown to see how the chart evolved as you filled out the prices above."
      )}
      menuItems={weekDaysCombined.map((weekday, idx) => {
        const indexInFilters = idx + 1;

        if (!filters[indexInFilters]) {
          // Ignore values left blank by the user
          return null;
        }

        return {
          text: weekday,
          value: indexInFilters,
        };
      })}
      onChange={(e) => {
        const { value } = e.target;
        setValue(value);
        dispatch({
          payload: {
            rewindEnabled: typeof value === "number",
            indexInHistory: value,
            filters,
          },
        });
      }}
    />
  );
};

export default Dropdown;
