import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {

  },
  pagination: {
    padding: '2em',
    '&>ul': {
      justifyContent: 'flex-end',
    },
  },
}));
