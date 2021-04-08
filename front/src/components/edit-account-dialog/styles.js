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
    maxHeight: '60px',
  },
  savingInitDate: {

  },
  savingTargetDate: {
    marginLeft: '2em',
  },
  savingFrequency: {

  },
  savingInitialAmount: {
    width: '234px',
  },
  savingTargetAmount: {
    marginLeft: '2em',
    width: '234px',
  },
}));
