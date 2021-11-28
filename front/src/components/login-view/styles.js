import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    textAlign: 'center',
    marginBottom: '20vh',
    padding: '1rem',
    [theme.breakpoints.up('lg')]: {
      border: '1px solid #ccc',
      borderRadius: '5px',
    }
  },
  title: {
    fontSize: '3rem',
    paddingBottom: '1rem',
  },
  email: {
    width: '100%',
    paddingBottom: '1rem',
  },
  password: {
    width: '100%',
    paddingBottom: '1rem',
  },
  button: {
    width: '100%',
  }
}));
