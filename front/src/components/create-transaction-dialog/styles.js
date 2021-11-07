import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
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
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  addButton: {
    border: '1px solid grey',
    borderRadius: '8px',
  },
}));
