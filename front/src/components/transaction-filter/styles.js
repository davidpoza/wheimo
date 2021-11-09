import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'center',
    '& > *': {
      margin: '10px',
    },
    height: '3em',
    [theme.breakpoints.up('lg')]: {
      height: 'auto',
    },
  },
  dateSelector: {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      display: 'block',
    },
    width: '7em',
    '& .MuiIconButton-root': {
      padding: '0',
    },
  },
  accountSelector: {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      display: 'block',
    },
  },
  search: {

  },
  chartsSwitch: {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      display: 'block',
    },
    alignSelf: 'normal',
    '& > label': {
      margin: 0,
    },
  },
}));
