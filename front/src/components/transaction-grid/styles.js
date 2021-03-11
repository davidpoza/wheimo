import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    flex: 1,
  },
  pagination: {
    padding: '2em',
    '&>ul': {
      justifyContent: 'flex-end',
    },
  },
}));
