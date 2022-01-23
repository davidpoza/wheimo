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
import IconButton from '@material-ui/core/IconButton';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import DayJsUtils from '@date-io/dayjs';
import dayjs from 'dayjs';
import i18n from 'utils/i18n';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

// own
import useStyles from './styles';
import AccountSelect from '../account-select';
import TagsSelect from '../tags-select';
import {
  create as createAction,
  update as updateAction,
  createEditDialogOpen as openAction,
  createEditDialogClose as closeAction,
} from '../../actions/transaction';
import {
  contextMenuChangeIndex as changeIndexAction,
} from '../../actions/ui';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

function CreateTransactionDialog({
  id,
  index,
  transactions,
  isOpen,
  open,
  close,
  user,
  createTransaction,
  updateTransaction,
  changeUIIndex,
  lng,
}) {
  const classes = useStyles();
  const [incoming, setIncoming] = useState(false);
  const [draft, setDraft] = useState(false);
  const [receipt, setReceipt] = useState(false);
  const [amount, setAmount] = useState(0.0);
  const [description, setDescription] = useState(undefined);
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
    if (transactions?.[index]) {
      setIncoming(transactions[index].amount > 0);
      setReceipt(transactions[index].receipt);
      setAmount(transactions[index].amount);
      setDescription(transactions[index].description);
      setComments(transactions[index].comments);
      setEmitterName(transactions[index].emitterName);
      setReceiverName(transactions[index].receiverName);
      setSelectedAccount(transactions[index].account.id);
      setTags(transactions[index].tags);
      setSelectedDate(new Date(transactions[index].date));
      setDraft(transactions[index].draft);
    }
  }

  function clearForm() {
    setIncoming(false);
    setReceipt(false);
    setAmount(0.0);
    setDescription(undefined);
    setComments('');
    setEmitterName('');
    setReceiverName('');
    setSelectedAccount(0);
    setTags([]);
    setSelectedDate(new Date());
    setHasErrors(true);
    setDraft(false);
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
    changeUIIndex(undefined);
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

  async function processData() {
    const data = {
      emitterName: emitterName || undefined,
      receiverName: receiverName || undefined,
      amount,
      description: description !== undefined ? description : undefined,
      comments: comments || undefined,
      tags,
      accountId: selectedAccount,
      currency: 'EUR',
      date: dayjs(selectedDate).format('YYYY-MM-DD'),
      valueDate: dayjs(selectedDate).format('YYYY-MM-DD'),
      draft,
    };

    if (index !== undefined) {
      updateTransaction(user.token, id, index, data);
    } else {
      createTransaction(user.token, data, true);
    }
    clearForm();
    close();
    changeUIIndex(undefined);
  }

  return (
    <div className={classes.root}>
      <IconButton className={classes.addButton} color="primary" aria-label="add" onClick={handleClickOpen} size="medium">
        <AddIcon fontSize="inherit" />
      </IconButton>
      <Dialog open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title" PaperComponent={PaperComponent}>
        <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
          { index !== undefined ? i18n.t('createTransaction.editTitle', { lng }) : i18n.t('createTransaction.addTitle', { lng }) }
        </DialogTitle>
        <DialogContent>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={draft} onChange={() => { setDraft(!draft); }} name="draft" />}
              label={i18n.t('createTransaction.draft', { lng })}
            />
          </FormGroup>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={receipt} onChange={() => { setReceipt(!receipt); }} name="receipt" />}
              label={i18n.t('createTransaction.receipt', { lng })}
            />
          </FormGroup>
          <div className={classes.selectGroup}>
            <MuiPickersUtilsProvider utils={DayJsUtils} className={classes.dateSelector}>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label={i18n.t('createTransaction.date', { lng })}
                format="DD/MM/YYYY"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
            <AccountSelect
              label={i18n.t('createTransaction.account', { lng })}
              value={selectedAccount}
              handleChange={(e) => { setSelectedAccount(e.target.value); }}
              layout="modal"
            />
          </div>

          <FormGroup row className={classes.transactionTargetSwitch}>
            <FormControlLabel
              control={<Switch checked={incoming} onChange={handleIncomingSwitch} name="incoming" />}
              label={incoming ? i18n.t('createTransaction.incomig', { lng }) : i18n.t('createTransaction.outgoing', { lng })}
            />
          </FormGroup>

          <TextField
            className={classes.transactionTargetTextField}
            margin="dense"
            id={incoming ? 'emitterName' : 'receiverName'}
            label={incoming ? i18n.t('createTransaction.emitter', { lng }) : i18n.t('createTransaction.receiver', { lng })}
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
            label={i18n.t('createTransaction.amount', { lng })}
            type="number"
            value={amount}
            onChange={handleAmountChange}
            fullWidth
          />

          <TextField
            margin="dense"
            id="description"
            label={i18n.t('createTransaction.description', { lng })}
            type="text"
            value={description}
            onChange={(e) => { setDescription(e.target.value); }}
            fullWidth
          />

          <TagsSelect
            label={i18n.t('createTransaction.tags', { lng })}
            value={tags}
            handleOnChange={ (e, value) => {
              setTags(value);
            } }
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {i18n.t('createTransaction.cancel', { lng })}
          </Button>
          <Button disabled={hasErrors} onClick={processData} color="primary">
            {
              index !== undefined
                ? i18n.t('createTransaction.save', { lng })
                : i18n.t('createTransaction.add', { lng })
            }
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

CreateTransactionDialog.propTypes = {
  id: PropTypes.number,
  index: PropTypes.number,
  isOpen: PropTypes.bool,
  open: PropTypes.func,
  close: PropTypes.func,
  user: PropTypes.object,
  createTransaction: PropTypes.func,
  updateTransaction: PropTypes.func,
  transactions: PropTypes.array,
  changeUIIndex: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  isOpen: state.transaction.createEditDialogOpen,
  contextMenuState: state.ui.contextMenuState,
  id: state.ui.contextMenuState.id,
  index: state.ui.contextMenuState.index,
  transactions: state.transaction.fetchedTransactions,
  lng: state.user?.current?.lang,
});

const mapDispatchToProps = (dispatch) => ({
  createTransaction: (token, data, refresh) => {
    dispatch(createAction(token, data, refresh))
      .catch((error) => {
        console.log(error.message);
      });
  },
  updateTransaction: (token, id, index, data) => {
    dispatch(updateAction(token, id, index, data))
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
  changeUIIndex: (index) => {
    dispatch(changeIndexAction(index));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateTransactionDialog);
