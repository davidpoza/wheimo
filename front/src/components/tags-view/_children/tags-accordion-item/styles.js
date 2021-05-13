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
  },
  summary: {
    margin: '0 10%',
    borderBottom: '1px solid #ccc',
    '&:hover': {
      backgroundColor: '#f5f5f5',
    },
  },
}));
