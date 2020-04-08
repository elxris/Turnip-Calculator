import React from "react";
import { Box, Breadcrumbs, Link } from "@material-ui/core";
import { useTranslation } from "react-i18next";

const Localizer = () => {
  const { i18n } = useTranslation();

  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  const languages = [
    ["en", "English"],
    ["de", "Deutsche"],
    ["es", "Español"],
    ["fr", "Français"],
    ["it", "Italiano"],
    ["zh-CN", "简体中文"],
    ["zh-TW", "繁体中文（台湾）"],
    ["zh-HK", "繁体中文（香港）"],
    ["ko", "한국어"],
  ];

  const languageList = [];

  languages.map(([tag, name]) => {
    languageList.push(<Link key={tag} href="#" onClick={() => {changeLanguage(tag)}}>{name}</Link>)
  });

  return (
    <Box
      borderRadius={16}
      display="flex"
      flexDirection="column"
    >
      <Breadcrumbs maxItems={languageList.length} aria-label="breadcrumb">
        {languageList}
      </Breadcrumbs>
    </Box>
  );
};

export default Localizer;
