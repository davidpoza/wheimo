import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  avatar: {
    width: theme.spacing(4),
    height: theme.spacing(4),
    margin: '0.5em 0.5em 0.5em 0',
    cursor: 'pointer',
  },
  username: {
    color: '#fff',
    cursor: 'pointer',
  },
  icon: {
    color: '#4d4d4d',
  }
}));
