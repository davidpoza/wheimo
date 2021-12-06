import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'end',
    width: '100%',
    justifyContent: 'center',
    height: '3em',
    [theme.breakpoints.up('lg')]: {
      height: 'auto',
    },
  },
  drawerRoot: {
    margin: '1em',
    width: '200px',
    [theme.breakpoints.up('lg')]: {
      width: 'auto',
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

  },
  search: {
    margin: '0 1em 1em 1em',
    [theme.breakpoints.up('lg')]: {
      height: 'auto',
    },
  },
  filterButton: {

  },
  chartButton: {

  },
  resetFilterButton: {
    marginTop: '3em',
    cursor: 'pointer',
  },
  limits: {
    '&>*': {
      width: '5em'
    },
    '& > :first-child': {
      marginRight: '1em',
    }
  },
  chartsSwitch: {
    alignSelf: 'normal',
    '& > label': {
      margin: 0,
    },
  },
}));
