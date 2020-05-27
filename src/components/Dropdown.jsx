import React from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  makeStyles,
} from "@material-ui/core";
import { string, arrayOf, shape, number, func, bool } from "prop-types";
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
}) => (
  <FormControl className={useDropdownStyles().formControl} disabled={disabled}>
    <InputLabel id={labelId}>{label}</InputLabel>
    <Select labelId={labelId} id={selectId} onChange={onChange}>
      <MenuItem value="">
        <em>Clear Selection</em>
      </MenuItem>
      {menuItems.map((item) => (
        <MenuItem value={item.value} key={item.value}>
          {item.text}
        </MenuItem>
      ))}
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
};

Dropdown.defaults = {
  onChange: () => {},
  label: "",
  labelId: "",
  selectId: "",
  helperText: "",
  disabled: false,
};

export const TimeTravelDropdown = ({ filters, dispatch }) => {
  const { weekDaysCombined } = useWeekDays();
  return (
    <Dropdown
      label="Choose a day and time"
      labelId="rewind-label"
      selectId="rewind-select"
      helperText="Use this dropdown to see how the chart evolved as you filled out the prices above."
      menuItems={weekDaysCombined.map((weekday, idx) => ({
        text: weekday,
        value: idx + 1, // The days/times start at index 1 in the "filters" array
      }))}
      onChange={(e) => {
        const { value } = e.target;
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
