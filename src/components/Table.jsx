import React, { createContext, useMemo } from "react";
import { arrayOf, number, string, func, bool } from "prop-types";
import {
  Table as MaterialTable,
  TableBody,
  TableCell as MaterialTableCell,
  TableContainer,
  TableHead,
  TableRow,
  makeStyles,
  IconButton,
  Box,
} from "@material-ui/core";
import {
  KeyboardArrowDown as OpenIcon,
  KeyboardArrowRight as CloseIcon,
} from "@material-ui/icons";
import { useTranslation } from "react-i18next";
import { useWeekDays } from "../utils";
import { v4 as uuidv4 } from "uuid";
import { useToggle } from "react-use";
import { useContext } from "react";
import styled, { css } from "styled-components";

const useStyles = makeStyles({
  container: {
    maxHeight: "50vh",
  },
});

const TableCell = styled(MaterialTableCell)`
  white-space: nowrap;
  padding: 0 4px;
  border: none;
  background: ${(props) => props.theme.palette.bkgs.table};
  color: rgba(0, 0, 0, 0.8);
  border-left: ${(props) =>
    props["data-am"] === 0 && "4px solid rgba(0, 0, 0, 0.2)"};

  ${(props) => {
    const color = {
      green: "#88c9a1",
      orange: "#88b0c9",
      red: "#c988b0",
      none: "rgba(0, 0, 0, 0.1)",
    }[props["data-color"]];
    return (
      color &&
      css`
        background: ${color};
      `
    );
  }};
`;

const RowContext = createContext({});

const PatternRow = ({ pattern, name, onClick, open }) => {
  const { quantiles, filters } = useContext(RowContext);
  return (
    <TableRow key={uuidv4()}>
      <TableCell>
        {onClick ? (
          <IconButton onClick={onClick} size="small">
            {open ? <OpenIcon /> : <CloseIcon />}
          </IconButton>
        ) : null}
      </TableCell>
      <TableCell>{name}</TableCell>
      <TableCell align="right">
        {pattern.probability
          ? `${(pattern.probability * 100).toFixed(2)}%`
          : ""}
      </TableCell>
      {pattern.map((_, index) => {
        const [min, max] = pattern[index];
        const filter = filters[index + 1];
        const color = ["red", "orange", "green"][
          quantiles.reduce(
            (prev, values, quantileIndex) =>
              values[index] < max ? quantileIndex : prev,
            0
          )
        ];

        return (
          <TableCell
            key={uuidv4()}
            align="center"
            data-color={filter ? "none" : color}
            data-am={index % 2}
          >
            {filter || (min !== max ? `${min}~${max}` : min)}
          </TableCell>
        );
      })}
    </TableRow>
  );
};
PatternRow.propTypes = {
  pattern: arrayOf(arrayOf(number)).isRequired,
  name: string.isRequired,
  onClick: func,
  open: bool,
};

const aggregate = (patterns) =>
  patterns.reduce(
    (acc, pattern) => {
      const { probability = 0 } = acc;
      const result = pattern.map(([min, max], index) => [
        Math.min(min, acc[index][0]),
        Math.max(max, acc[index][1]),
      ]);
      result.probability = probability + pattern.probability;
      result.pattern = pattern.pattern;
      return result;
    },
    Array.from({ length: 12 }, (_, i) => [700, 0])
  );

const AggregatedPatterns = ({ patterns, name, expanded }) => {
  const [open, toggleOpen] = useToggle(Boolean(expanded));
  if (!patterns.length) return null;
  if (patterns.length === 1) {
    return <PatternRow pattern={patterns[0]} name={name} />;
  }
  if (patterns.length > 1) {
    const aggregatedPattern = aggregate(patterns);
    return (
      <>
        <PatternRow
          name={name}
          onClick={toggleOpen}
          open={open}
          pattern={aggregatedPattern}
        />
        {open &&
          patterns.map((pattern) => (
            <PatternRow key={uuidv4()} name={`-`} pattern={pattern} />
          ))}
      </>
    );
  }
  return null;
};
AggregatedPatterns.propTypes = {
  patterns: arrayOf(arrayOf(arrayOf(number))).isRequired,
  name: string.isRequired,
  expanded: bool,
};

const DataRows = ({
  patterns,
  minMaxPattern,
  quantiles,
  filters,
  expanded,
}) => {
  const { t } = useTranslation();
  const patternNames = t("patternNames").split("_");
  if (!patterns) return null;
  return (
    <RowContext.Provider value={{ quantiles, filters }}>
      <PatternRow pattern={minMaxPattern} name={t("All Patterns")} />
      {patternNames.map((name, index) => (
        <AggregatedPatterns
          key={uuidv4()}
          name={name}
          patterns={patterns.filter(({ pattern }) => pattern === index)}
          expanded={expanded}
        />
      ))}
    </RowContext.Provider>
  );
};

DataRows.propTypes = {
  patterns: arrayOf(arrayOf(arrayOf(number))),
  minMaxPattern: arrayOf(arrayOf(number)),
  quantiles: arrayOf(arrayOf(number)),
  filters: arrayOf(number),
  expanded: bool,
};

const Table = ({ filters, patterns, minMaxPattern, quantiles, expanded }) => {
  const { t } = useTranslation();
  const classes = useStyles();
  const { weekDays } = useWeekDays();

  return useMemo(
    () => (
      <Box
        bgcolor="bkgs.table"
        borderRadius={8}
        display="flex"
        flexDirection="column"
        mt={2}
        overflow="hidden"
      >
        <TableContainer className={classes.container}>
          <MaterialTable size="small" padding="none" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell align="center">{t("Pattern")}</TableCell>
                <TableCell align="center">{t("Chance")}</TableCell>
                {weekDays.map((day) => (
                  <TableCell key={day} align="center" colSpan={2}>
                    {day}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              <DataRows
                patterns={patterns}
                minMaxPattern={minMaxPattern}
                quantiles={quantiles}
                filters={filters}
                expanded={expanded}
              />
            </TableBody>
          </MaterialTable>
        </TableContainer>
      </Box>
    ),
    [
      classes.container,
      expanded,
      filters,
      minMaxPattern,
      patterns,
      quantiles,
      t,
      weekDays,
    ]
  );
};

Table.propTypes = {
  patterns: arrayOf(arrayOf(arrayOf(number))),
  minMaxPattern: arrayOf(arrayOf(number)),
  quantiles: arrayOf(arrayOf(number)),
  filters: arrayOf(number),
  expanded: bool,
};

export default Table;
