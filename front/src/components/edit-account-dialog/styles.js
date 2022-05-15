import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {

  },
  additionalConfig: {
    fontWeight: 'normal',
    fontSize: '1.2em',
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
    width: '250px',
  },
  savingAmountFunc: {
    marginLeft: '2em',
    width: '250px',
  },
  savingAmount: {
    width: '250px',
  },
  savingTargetAmount: {
    marginLeft: '2em',
    width: '250px',
  },
  accessId: {
    width: '250px',
  },
  accessPassword: {
    marginLeft: '2em',
    width: '250px',
  },
  bankSelector: {
    width: '14em',
    marginBottom: '6px',
  },
}));
