import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/styles";
import { Tab, Tabs } from "@material-ui/core";
import { Add, Close } from "@material-ui/icons";

const useTabsStyles = makeStyles(({ spacing }) => ({
  root: {
    marginLeft: spacing(2),
  },
  indicator: {
    backgroundColor: "#18A558",
  },
}));

const useTabStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    textTransform: "initial",
    padding: spacing(-1, 2),
    minWidth: 0,
    [breakpoints.up("md")]: {
      minWidth: 0,
    },
    "&:hover": {
      backgroundColor: "rgba(13, 152, 186, 0.1)",
      "& .MuiTab-label": {
        color: "#18A558",
      },
    },
    "&$selected": {
      "& *": {
        color: "#18A558",
      },
    },
  },
  selected: {},
  textColorInherit: {
    opacity: 1,
  },
  wrapper: {
    textTransform: "initial",
    flexDirection: "row-reverse",
    letterSpacing: 0.5,
    '& svg, .material-icons': {
      marginLeft: 12,
      marginTop: 7,
    },
  },
}));

const IslandTabs = ({ tabs, onAdd, onDelete, onChange, value }) => {
  const tabClasses = useTabStyles();
  const tabsClasses = useTabsStyles();

  return (
    <Tabs variant="scrollable" scrollButtons="auto" value={value} onChange={onChange} classes={tabsClasses}>
      {tabs.map((tab) => (
        <Tab
          key={tab.key}
          label={`Island ${tab.id + 1}`}
          disableRipple
          icon={<Close id={tab.id} onClick={onDelete} fontSize="small" />}
          classes={{
            ...tabClasses,
            wrapper: `${tabClasses.wrapper} MuiTab-label`,
          }}
        />
      ))}
      <Tab label="Add island" classes={tabClasses} icon={<Add onClick={onAdd} />} />
    </Tabs>
  );
};

IslandTabs.propTypes = {
  tabs: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      key: PropTypes.string.isRequired,
    }),
  ),
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onAdd: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default IslandTabs;
