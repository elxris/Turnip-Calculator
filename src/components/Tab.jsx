import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import AssignmentOutlinedIcon from '@material-ui/icons/AssignmentOutlined';

const useStyles = makeStyles((theme) => ({
  tabs: {

  },
  tab: {
      '& .MuiAppBar-root': {
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16
      }
  }
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <Typography
      className={classes.tabs}
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {
          value === index &&
            <Box bgcolor="rgba(0,0,0,0)">{children}</Box>
      }
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

export default function SimpleTabs({children, mx}) {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box className={classes.tab} mx={mx}>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example" variant="fullWidth">
          <Tab icon={<AssignmentOutlinedIcon/>} {...a11yProps(0)} />
          <Tab icon={<AssessmentOutlinedIcon/>} {...a11yProps(1)} />
        </Tabs>
      </AppBar>

      {
          children.map((child, index) => {
              return <TabPanel value={value} index={index} key={index}>
                {child}
              </TabPanel>
          })
      }
    </Box>
  );
}

SimpleTabs.propTypes = {
  mx: PropTypes.array
};

export { SimpleTabs }
