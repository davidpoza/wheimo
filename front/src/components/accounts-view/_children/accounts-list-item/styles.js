import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    width: 'auto',
    margin: '0 10%',
    borderBottom: '1px solid #ccc',
    cursor: 'pointer',
  },
  rulesCounter: {
    fontSize: '0.8em',
    color: 'grey',
  },
  icon: {
    color: '#ccc',
    marginRight: '10px',
  },
  balance: {
    fontSize: '1.2em',
    textAlign: 'right',
  },
  positiveBalance: {
    color: 'darkcyan',
  },
  negativeBalance: {
    color: '#f50057',
  },
  number: {
    fontSize: '0.8em',
  },
}));
