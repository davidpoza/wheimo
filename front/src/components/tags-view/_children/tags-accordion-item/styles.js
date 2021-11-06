import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    padding: '0 30px',
    boxShadow: 'none',
    position: 'inherit',
  },
  rulesCounter: {
    fontSize: '0.8em',
    color: 'grey',
  },
  icon: {
    color: '#ccc',
    marginRight: '10px',
    //paddingTop: '4px',
  },
  summaryContent: {
    width: '100%',
  },
  summary: {
    borderBottom: '1px solid #ccc',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  button: {
    padding: '1px',
    '&:first-child': {
      marginRight: '0.5em',
    },
  },
  body: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between'
  },
}));
