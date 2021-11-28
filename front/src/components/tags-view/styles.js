import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    [theme.breakpoints.up('lg')]: {
      margin: '0 20%',
    },
    flexDirection: 'column',
    // justifyContent: 'space-between',
  },
}));
