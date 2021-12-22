import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    width: '140px',

    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '0',
    [theme.breakpoints.up('md')]: {
      width: '800px',
      padding: '5% 10%',

    }
  },

}));
