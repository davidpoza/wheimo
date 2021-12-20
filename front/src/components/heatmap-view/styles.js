import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '140px',
    margin: 'auto',
    padding: '0',
    [theme.breakpoints.up('lg')]: {
      padding: '20% 20%',

    }
  },

}));
