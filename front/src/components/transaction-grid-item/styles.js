import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    fontSize: '0.9em',
    borderTop: theme.palette.type === 'dark' ? '1px solid #424242' : '1px solid #ccc',
    padding: '0 20px 0 20px',
    height: '60px',
  },
  checkbox: {
    minWidth: '0px',
    [theme.breakpoints.up('lg')]: {
      display: 'block',
      minWidth: '30px',
    },
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
  attachments: {
    marginLeft: 'auto',
  },
  date: {
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
    width: '5em',

  },
  icon: {
    '&>svg': {
      verticalAlign: 'text-bottom',
    },
  },
  up: {
    color: '#f50057',
    [theme.breakpoints.up('lg')]: {
      color: 'inherit',
    },
    '&>svg': {
      color: '#f50057',
    },
  },
  down: {
    color: 'darkcyan',
    [theme.breakpoints.up('lg')]: {
      color: 'inherit',
    },
    '&>svg': {
      color: 'darkcyan',
    },
  },
  star: {
    color: '#ccc',
    alignSelf: 'normal',
    '&>svg': {
      verticalAlign: 'text-bottom',
    },
  },
  emitter: {
    textTransform: 'capitalize',
    marginLeft: '0.6em',
    width: '14em',
    maxWidth: '14em',
  },
}));
