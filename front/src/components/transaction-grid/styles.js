import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.up('lg')]: {
      margin: '0 20%',
    },
  },
  pagination: {
    padding: '1em',
    '&>ul': {
      justifyContent: 'flex-end',
    },
  },
  bottomBar: {
    margin: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsCounter: {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      display: 'block',
    },
    fontSize: '0.9em',
    padding: '1em',
    fontWeight: 300,
  },
}));
