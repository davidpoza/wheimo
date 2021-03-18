import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    fontSize: '0.9em',
    padding: '1em',
    fontWeight: 300,
  },
}));
