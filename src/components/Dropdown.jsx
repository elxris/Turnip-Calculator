import React from "react";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  makeStyles,
} from "@material-ui/core";
import { string, arrayOf, shape, number, func } from "prop-types";

const useDropdownStyles = makeStyles({
  formControl: {
    width: "100%",
  },
});

const Dropdown = ({ menuItems, onChange, label, labelId, selectId }) => (
  <FormControl className={useDropdownStyles().formControl}>
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
};

Dropdown.defaults = {
  onChange: () => {},
  label: "",
  labelId: "",
  selectId: "",
};

export default Dropdown;
