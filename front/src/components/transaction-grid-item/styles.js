import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    fontSize: '0.9em',
    borderTop: '1px solid #ccc',
    padding: '0 30px 0 20px',
    height: '60px',
  },
  checkbox: {
    minWidth: '30px',
  },
  activeStar: {
    color: '#eea300',
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
  secondLine: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  description: {
    padding: '5px 0 5px 3px',
    height: '1em',
    fontWeight: '100',
  },
  date: {
    marginLeft: 'auto',
    fontWeight: '100',
    fontSize: '0.9em',
  },
  account: {
    fontSize: '0.8em',
    textTransform: 'uppercase',
  },
  tags: {
    marginLeft: '1em',
  },
  amount: {
    marginLeft: '0.1em',
    fontWeight: 'bold',
    width: '4em',

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
    alignSelf: 'normal',
    '&>svg': {
      verticalAlign: 'text-bottom',
    },
  },
  emitter: {
    marginLeft: '0.6em',
    width: '13em',
    maxWidth: '13em',
  },
}));
