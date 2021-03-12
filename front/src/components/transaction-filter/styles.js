import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'center',
    '& > *': {
      margin: '10px',
    },
  },
  dateSelector: {
    width: '9em',
  },
}));
