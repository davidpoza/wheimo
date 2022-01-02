import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    '&:hover': {
      backgroundColor: theme.palette.type === 'dark' ? '#424242' : '#f5f5f5',
    },
  },
  indexColumn: {
    width: '1em',
    padding: 0,
  },
  deleteButton: {
    cursor: 'pointer',
  },
}));
