import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 10px 0 14px',
  },
  createButton: {
    cursor: 'pointer',
  },
  input: {
    fontSize: '1.2em',
    // eslint-disable-next-line max-len
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
    fontWeight: 300,
    width: '92%',
    borderRadius: '5px',
    '&:focus': {
      outlineColor: '#3f51b5',
    },
  },
}));
