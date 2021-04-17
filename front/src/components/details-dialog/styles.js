import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    fontSize: '0.9em',
    fontWeight: '300',
  },
  h2: {
    fontWeight: 'normal',
    fontSize: '1.2em',
    margin: '0.8em 0 0.3em 0',
    textTransform: 'capitalize',
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
  item: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    borderBottom: '1px solid #dedfe0',
  },
  attachmentInput: {
    display: 'none',
  },
  attachmentButton: {
    fontSize: '1em',
    marginRight: 'auto',
  },
}));
