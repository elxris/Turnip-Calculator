import React, { useMemo, useEffect } from "react";
import { Box, Breadcrumbs, Link, makeStyles } from "@material-ui/core";
import { useTranslation } from "react-i18next";
import { useLocalStorage } from "react-use";

const languages = [
  ["en", "English"],
  ["de", "Deutsch"],
  ["es", "Español"],
  ["fr", "Français"],
  ["nl", "Nederlands"],
  ["it", "Italiano"],
  ["zh-CN", "简体中文"],
  ["zh-TW", "繁體中文（台灣）"],
  ["zh-HK", "繁體中文（香港）"],
  ["ko", "한국어"],
  ["ja", "日本語"],
  ["pt-BR", "Português"],
  ["ru", "Русский"]
];

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
  }, []);

  return useMemo(
    () => (
      <Box mx={["0%", "10%", "25%"]}>
        <Breadcrumbs
          classes={classes}
          maxItems={languages.length}
          component="div"
          aria-label="languages"
        >
          {languages.map(([tag, name]) => (
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
    []
  );
};

export default Localizer;
