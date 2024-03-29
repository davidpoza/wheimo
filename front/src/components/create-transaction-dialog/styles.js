import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {

  },
  comments: {
    marginBottom: '2em',
  },
  transactionTargetSwitch: {
    marginTop: '1.2em',
  },
  transactionTargetTextField: {
    marginTop: 0,
    '& > .MuiInput-formControl': {
      marginTop: '1em',
    },
  },
  selectGroup: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    [theme.breakpoints.up('lg')]: {
      alignItems: 'flex-end',
      flexDirection: 'row',
    },
  },
  addButton: {

  },
}));
