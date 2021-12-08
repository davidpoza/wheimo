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
    padding: '1em',
    width: '200px',
    [theme.breakpoints.up('lg')]: {
      width: '300px',
    },
  },
  drawerDocked: {
    width: 0,
    padding: 0,
    margin: 0,
  },
  dateSelector: {
    display: 'block',
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
    border: '1px solid grey',
    borderRadius: '5px',
    padding: '5px',
    marginTop: '3em',
    cursor: 'pointer',
  },
  closeFilterButton: {
    color: 'white',
    border: '1px solid #3f51b5',
    borderRadius: '5px',
    backgroundColor: '#3f51b5',
    padding: '5px',
    marginTop: '1em',
    cursor: 'pointer',
  },
  limits: {
    textAlign: 'left',
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
