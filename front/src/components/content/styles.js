import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    paddingTop: '60px',
    [theme.breakpoints.up('lg')]: {
      paddingTop: '70px',
    },
    flex: 1,
    display: 'flex',
    // justifyContent: 'flex-end',
    flexDirection: 'column',
  },
}));
