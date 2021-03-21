import { makeStyles } from '@material-ui/core/styles';

const input = {
  fontSize: '1em',
  // eslint-disable-next-line max-len
  fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif",
  fontWeight: 300,
  padding: '0.5em',
  width: '100%',
  border: '1px solid #ccc',
  borderRadius: '5px',
  height: '1.3em',
  '&:focus': {
    outlineColor: '#3f51b5',
  },
};

export default makeStyles(() => ({
  root: {

  },
  createButton: {
    cursor: 'pointer',
    paddingRight: 0,
  },
  input,
  inputWithSubmit: {
    ...input,
    width: '80%',
  },
  valueCell: {
    display: 'flex',
    flexDirection: 'inherit',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  typeSelect: {
    height: '2.2em',
    maxWidth: '10em',
    width: '10em',
  },
}));
