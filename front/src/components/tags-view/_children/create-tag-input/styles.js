import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '2em 0.5em',
  },
  icon: {
    color: '#3f51b5',
  },
  input: {
    fontSize: '1.2em',
    // eslint-disable-next-line max-len
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontWeight: 300,
    padding: '0.8em',
    width: '80%',
    border: '1px solid #ccc',
    borderRadius: '5px',
    '&:focus': {
      outlineColor: '#3f51b5',
    },
  },
}));
