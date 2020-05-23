import React from "react";
import { AppBar, Tabs, Tab, CssBaseline, ThemeProvider, Container, Box } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import Close from "@material-ui/icons/Close";
import { makeStyles } from "@material-ui/core/styles";
import { ThemeProvider as StyledComponentsThemeProvider } from "styled-components";
import {
  useTitle,
  useTabs,
  theme,
} from "../utils";
import { Title, Footer, TabPanel } from "../containers";

const App = () => {
  useTitle();
  const tabClasses = useTabStyles();
  const tabsClasses = useTabsStyles();
  const iconClasses = useIconStyles();
  const {tabs, addTab, deleteTab, value, setValue} = useTabs();

  const handleTabChange = (_event, newValue) => {
    if (newValue === tabs.length) {
      addTab();
    } else {
      setValue(newValue);
    }
  };

  const tabsMarkup = tabs.map((tab, index) => {
    return (
      <Tab
        key={tab.key}
        value={index}
        label={`Island ${tab.id + 1}`}
        classes={tabClasses}
        icon={<Close id={tab.id} onClick={deleteTab} fontSize="small" classes={iconClasses} />}
      />
    );
  });

  const panelMarkup = tabs.map((tab, index) => {
    return (
      <TabPanel key={tab.key} value={value} filterKey={tab.key} index={index} />
    );
  });

  return (
    <ThemeProvider theme={theme}>
      <StyledComponentsThemeProvider theme={theme}>
        <CssBaseline />
        <Container maxWidth="md">
          <Title />
          <Box mx={[-1.5, 0]}>
          <AppBar position="static">
            <Tabs value={value} onChange={handleTabChange} scrollButtons="auto" variant="scrollable" classes={tabsClasses}>
              {tabsMarkup}
              <Tab label="Add island" icon={<AddIcon onClick={addTab} />} />
            </Tabs>
          </AppBar>
          {panelMarkup}
          <Footer />
        </Box>
        </Container>
      </StyledComponentsThemeProvider>
    </ThemeProvider>
  );
};

const useTabsStyles = makeStyles(({ spacing, palette }) => ({
  root: {
    marginLeft: spacing(1),
  },
  indicator: {
    height: 3,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    backgroundColor: palette.common.white,
  },
}));

const useTabStyles = makeStyles(({ breakpoints, spacing }) => ({
  root: {
    textTransform: 'initial',
    margin: spacing(0, 2),
    minWidth: 0,
    [breakpoints.up('md')]: {
      minWidth: 0,
    },
  },
  wrapper: {
    flexDirection: 'row-reverse',
    fontWeight: 'normal',
    letterSpacing: 0.5,
  },
}));

const useIconStyles = makeStyles(({ spacing }) => ({
  root: {
    marginTop: spacing(1),
    marginLeft: spacing(1.5),
  },
}));

export default App;
