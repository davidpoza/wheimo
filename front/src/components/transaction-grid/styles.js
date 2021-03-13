import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  pagination: {
    padding: '2em',
    '&>ul': {
      justifyContent: 'flex-end',
    },
  },
  bottomBar: {
    margin: '0 3em 0 3em',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  resultsCounter: {
    fontSize: '0.9em',
    fontWeight: 300,
  },
}));
