import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  buttons: {
    color: theme.palette.type === 'dark' ? '#fff' : '#000'
  }
}));
