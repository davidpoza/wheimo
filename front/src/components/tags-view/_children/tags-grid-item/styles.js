import { makeStyles } from '@material-ui/core/styles';
import { Block } from '@material-ui/icons';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    fontSize: '0.9em',
    borderTop: '1px solid #ccc',
    padding: '0 30px 0 20px',
    height: '60px',
    alignItems: 'center',
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
    padding: 0,
    [theme.breakpoints.up('lg')]: {
      padding: '0px 16px',
    },
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
  button: {
    display: 'none',
    [theme.breakpoints.up('lg')]: {
      display: 'inline',
    },
    padding: '1px',
    '&:first-child': {
      marginRight: '0.5em',
    },
  },
  body: {
    width: '100%',
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'left',
  },
}));