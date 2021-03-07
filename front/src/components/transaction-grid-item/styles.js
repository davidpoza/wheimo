import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    borderTop: '1px solid #ccc',
    paddingBottom: '10px',
  },
  content: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  firstLine: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
  },
  description: {
    padding: '5px 0 5px 0',
    fontWeight: '100',
  },
  date: {
    marginLeft: 'auto',
    fontWeight: '100',
    fontSize: '0.9em',
  },
  account: {
    fontSize: '0.8em',
  },
  tags: {
    marginLeft: '1em',
  },
  amount: {
    marginLeft: '0.6em',
    fontWeight: 'bold',
  },
  icon: {
    '&>svg': {
      verticalAlign: 'text-bottom',
    },
  },
  up: {
    color: '#f50057',
  },
  down: {
    color: 'darkcyan',
  },
  star: {
    color: '#ccc',
    '&>svg': {
      verticalAlign: 'text-bottom',
    },
  },
  emitter: {
    marginLeft: '0.5em',
  },
}));
