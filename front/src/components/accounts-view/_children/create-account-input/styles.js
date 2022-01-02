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
    padding: '0.8em',
    width: '92%',
    color: theme.palette.type === 'dark' ? '#f5f5f5' : '#424242',
    backgroundColor: theme.palette.type === 'dark' ? '#424242' : '#f5f5f5',
    border: theme.palette.type === 'dark' ? '1px solid #272121' : '1px solid #ccc',
    borderRadius: '5px',
    '&:focus': {
      outlineColor: '#3f51b5',
    },
  },
}));
