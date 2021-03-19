import React from 'react';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import { Link } from 'react-router-dom';
import { default as TagIcon } from '@material-ui/icons/LocalOffer';
import SettingsIcon from '@material-ui/icons/Settings';
import { default as AccountIcon } from '@material-ui/icons/AccountBalance';
import { default as TransactionIcon } from '@material-ui/icons/Receipt';
import { default as ReportIcon } from '@material-ui/icons/Assessment';

// own
import useStyles from './styles';

export default function Navigation() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue) => {
        setValue(newValue);
      }}
      showLabels
      className={classes.root}
    >
      <BottomNavigationAction
        label="Transactions"
        icon={<TransactionIcon />}
        component={Link}
        to="/"
      />
      <BottomNavigationAction label="Accounts" icon={<AccountIcon />} />
      <BottomNavigationAction label="Reports" icon={<ReportIcon />} />
      <BottomNavigationAction
        label="Tags & Rules"
        icon={<TagIcon />}
        component={Link}
        to="/tags"
      />
      <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
    </BottomNavigation>
  );
}
