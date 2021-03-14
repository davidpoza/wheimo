import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import dayjs from 'dayjs';

// own
import useStyles from './styles';
import {
  create as createAction,
  update as updateAction,
  detailsDialogOpen as openAction,
  detailsDialogClose as closeAction,
} from '../../actions/transaction';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

function DetailsDialog({
  id,
  index,
  transactions,
  isOpen,
  open,
  close,
  user,
  createTransaction,
  updateTransaction,
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
      setSelectedDate(new Date(transactions[index].date));
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

  async function processData() {
    const data = {
      emitterName: emitterName || undefined,
      receiverName: receiverName || undefined,
      amount,
      description: description || undefined,
      comments: comments || undefined,
      tags,
      accountId: selectedAccount,
      currency: 'EUR',
      date: dayjs(selectedDate).format('YYYY-MM-DD'),
      valueDate: dayjs(selectedDate).format('YYYY-MM-DD'),
    };

    if (index !== undefined) {
      updateTransaction(user.token, id, index, data);
    } else {
      createTransaction(user.token, data);
    }
    clearForm();
    close();
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} aria-labelledby="form-dialog-title" PaperComponent={PaperComponent}>
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        Transaction details
      </DialogTitle>
      <DialogContent>

      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button disabled={hasErrors} onClick={processData} color="primary">
          { index !== undefined ? 'Save changes' : 'Add' }
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DetailsDialog.propTypes = {
  id: PropTypes.number,
  index: PropTypes.number,
  isOpen: PropTypes.bool,
  open: PropTypes.func,
  close: PropTypes.func,
  user: PropTypes.object,
  createTransaction: PropTypes.func,
  updateTransaction: PropTypes.func,
  transactions: PropTypes.array,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  isOpen: state.transaction.detailsDialogOpen,
  contextMenuState: state.transaction.contextMenuState,
  id: state.transaction.contextMenuState.id,
  index: state.transaction.contextMenuState.index,
  transactions: state.transaction.transactionsFetched,
});

const mapDispatchToProps = (dispatch) => ({
  createTransaction: (token, data) => {
    dispatch(createAction(token, data))
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
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsDialog);
