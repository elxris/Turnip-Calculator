import React from "react";
import { Select, MenuItem } from "@material-ui/core";

const Dropdown = ({ menuItems }) => {
  console.log("Heres Dropdown");
  return (
    <Select>
      {menuItems.map((item, idx) => (
        <MenuItem key={idx}>{item.text}</MenuItem>
      ))}
    </Select>
  );
};

export default Dropdown;
