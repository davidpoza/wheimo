import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    margin: 0,
    [theme.breakpoints.up('lg')]: {
      margin: '0 20%',
    },
  },
}));
