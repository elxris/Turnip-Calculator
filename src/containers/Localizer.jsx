import React, { useMemo, useEffect } from "react";
import { Box, Breadcrumbs, Link, makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "react-use";
import { list } from "../locales";

const useStyles = makeStyles((theme) => ({
  ol: {
    justifyContent: "center",
  },
  separator: {
    color: theme.palette.bkgs.mainAlt,
  },
}));

const Localizer = () => {
  const { i18n } = useTranslation();
  const classes = useStyles();
  const [defaultLang, setDefaultLang] = useLocalStorage();

  // First mount effect
  useEffect(() => {
    i18n.changeLanguage(defaultLang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return useMemo(
    () => (
      <Box mx={["0%", "10%", "25%"]}>
        <Breadcrumbs
          classes={classes}
          maxItems={list.length}
          component="div"
          aria-label="languages"
        >
          {list.map(([tag, name]) => (
            <Link
              key={tag}
              href="#"
              onClick={() => {
                i18n.changeLanguage(tag);
                setDefaultLang(tag);
              }}
            >
              {name}
            </Link>
          ))}
        </Breadcrumbs>
      </Box>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );
};

export default Localizer;
