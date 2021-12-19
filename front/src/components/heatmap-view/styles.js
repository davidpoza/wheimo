import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    overflowY: 'auto',
    height: 'fit-content',
    width: '100%',
    margin: '0 auto',
    padding: 0,
    [theme.breakpoints.up('lg')]: {
      padding: '0 20%',

    }
  },
  heatMap: {
    padding: '0 5px',
    height: '280px',
    maxWidth: '60%'
  }
}));
