import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import DayJsUtils from '@date-io/dayjs';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

// own
import useStyles from './styles';
import AccountSelect from '../account-select';
import TagsSelect from '../tags-select';
import {
  create,
  createEditDialogOpen as openAction,
  createEditDialogClose as closeAction,
} from '../../actions/transaction';

function CreateTransactionDialog({
  index,
  transactions,
  isOpen,
  open,
  close,
  user,
  createTransaction,
}) {
  const classes = useStyles();
  const [incoming, setIncoming] = useState(false);
  const [receipt, setReceipt] = useState(false);
  const [amount, setAmount] = useState(0.0);
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const [emitterName, setEmitterName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [tags, setTags] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [hasErrors, setHasErrors] = useState(true);

  function amountSignCorrection(val) {
    if (incoming) {
      setAmount(Math.abs(val));
    } else {
      setAmount(Math.abs(val) * -1);
    }
  }

  function setInitialState() {
    if (transactions[index]) {
      setIncoming(transactions[index].amount > 0);
      setReceipt(transactions[index].receipt);
      setAmount(transactions[index].amount);
      setDescription(transactions[index].description);
      setComments(transactions[index].comments);
      setEmitterName(transactions[index].emitterName);
      setReceiverName(transactions[index].receiverName);
      setSelectedAccount(transactions[index].accountId);
      setTags(transactions[index].tags);
      setSelectedDate(transactions[index].selectedDate);
    }
  }

  function clearForm() {
    setIncoming(false);
    setReceipt(false);
    setAmount(0.0);
    setDescription('');
    setComments('');
    setEmitterName('');
    setReceiverName('');
    setSelectedAccount(0);
    setTags([]);
    setSelectedDate(new Date());
    setHasErrors(true);
  }

  useEffect(() => {
    if (index !== undefined) {
      setInitialState();
    }
  }, [index]);

  useEffect(() => {
    amountSignCorrection(amount);
  }, [incoming]);

  // controls hasErrors
  useEffect(() => {
    if (selectedAccount === 0) {
      setHasErrors(true);
    } else {
      setHasErrors(false);
    }
  }, [selectedAccount]);

  function handleDateChange(date) {
    setSelectedDate(date);
  }

  function handleClickOpen() {
    open();
  }

  function handleClose() {
    clearForm();
    close();
  }

  function handleIncomingSwitch() {
    setIncoming(!incoming);
  }

  function handleAmountChange(e) {
    const str = e.target.value;
    if (str) {
      amountSignCorrection(parseFloat(str, 10));
    }
  }

  async function handleCreate() {
    createTransaction(user.token, {
      emitterName,
      receiverName,
      amount,
      description,
      comments,
      tags,
      accountId: selectedAccount,
      currency: 'EUR',
      date: selectedDate,
      valueDate: selectedDate,
    });
    clearForm();
    close();
  }

  return (
    <div>
      <Fab className={classes.addButton} color="primary" aria-label="add" onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <Dialog open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">
          { index !== undefined ? 'Edit transaction' : 'Add manual transaction' }
        </DialogTitle>
        <DialogContent>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={receipt} onChange={() => { setReceipt(!receipt); }} name="receipt" />}
              label={receipt ? 'It\'s a receipt' : 'It\'s not a receipt'}
            />
          </FormGroup>
          <div className={classes.selectGroup}>
            <MuiPickersUtilsProvider utils={DayJsUtils} className={classes.dateSelector}>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Transaction date"
                format="DD/MM/YYYY"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
            <AccountSelect
              label="Account"
              value={selectedAccount}
              handleChange={(e) => { setSelectedAccount(e.target.value); }}
            />
          </div>

          <FormGroup row className={classes.transactionTargetSwitch}>
            <FormControlLabel
              control={<Switch checked={incoming} onChange={handleIncomingSwitch} name="incoming" />}
              label={incoming ? 'It\'s an incoming transaction' : 'It\'s an outgoing transaction'}
            />
          </FormGroup>

          <TextField
            className={classes.transactionTargetTextField}
            margin="dense"
            id={incoming ? 'emitterName' : 'receiverName'}
            label={incoming ? 'Emitter' : 'Receiver'}
            type="text"
            value={incoming ? emitterName : receiverName}
            onChange={(e) => {
              if (incoming) {
                setEmitterName(e.target.value);
              } else {
                setReceiverName(e.target.value);
              }
            }}
            fullWidth
          />

          <TextField
            required
            margin="dense"
            id="amount"
            label="Amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            fullWidth
          />

          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            value={description}
            onChange={(e) => { setDescription(e.target.value); }}
            fullWidth
          />

          <TextField
            className={classes.comments}
            multiline
            margin="dense"
            id="comments"
            label="Comments"
            type="text"
            value={comments}
            onChange={(e) => { setComments(e.target.value); }}
            fullWidth
          />
          <TagsSelect
            label="Tags"
            value={tags}
            handleOnChange={ (e, value) => {
              setTags(value);
            } }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button disabled={hasErrors} onClick={handleCreate} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

CreateTransactionDialog.propTypes = {
  index: PropTypes.number,
  isOpen: PropTypes.bool,
  open: PropTypes.func,
  close: PropTypes.func,
  user: PropTypes.object,
  createTransaction: PropTypes.func,
  transactions: PropTypes.array,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  isOpen: state.transaction.createEditDialogOpen,
  contextMenuState: state.transaction.contextMenuState,
  index: state.transaction.contextMenuState.index,
  transactions: state.transaction.transactionsFetched,
});

const mapDispatchToProps = (dispatch) => ({
  createTransaction: (token, data) => {
    dispatch(create(token, data))
      .catch((error) => {
        console.log(error.message);
      });
  },
  open: () => {
    dispatch(openAction());
  },
  close: () => {
    dispatch(closeAction());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateTransactionDialog);
