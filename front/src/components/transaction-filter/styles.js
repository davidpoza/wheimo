import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    '& > *': {
      margin: '10px',
    },
  },
}));
