import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    // display: 'flex',
    // flexDirection: 'column',
    flex: 1,
    // alignItems: 'center',
    [theme.breakpoints.up('lg')]: {
      margin: '0 20%',
    },
  },
}));
