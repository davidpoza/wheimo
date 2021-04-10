import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import DayJsUtils from '@date-io/dayjs';

import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

// own
import useStyles from './styles';
import { calculateSavingSeries } from '../../utils/utilities';
import {
  editDialogOpen as openAction,
  editDialogClose as closeAction,
  update as updateAction,
} from '../../actions/account';
import {
  contextMenuChangeIndex as changeIndexAction,
  contextMenuChangeId as changeIdAction,
} from '../../actions/ui';
import AccountTypeSelect from '../account-type-select';
import SavingsChart from '../savings-chart';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

function EditAccountDialog({
  id,
  index,
  accounts,
  isOpen,
  close,
  user,
  updateTag,
  changeUIId,
  changeUIIndex,
}) {
  const classes = useStyles();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('');
  const [balance, setBalance] = useState();
  const [savingAmount, setSavingAmount] = useState();
  const [savingTargetAmount, setSavingTargetAmount] = useState();
  const [savingInitDate, setSavingInitDate] = useState();
  const [savingTargetDate, setSavingTargetDate] = useState();
  const [savingAmountFunc, setSavingAmountFunc] = useState();
  const [savingFrequency, setSavingFrequency] = useState();

  function handleClose() {
    changeUIIndex(undefined);
    changeUIId(undefined);
    close();
  }

  function setInitialState() {
    if (accounts[index]) {
      setName(accounts[index].name);
      setType(accounts[index].bankId);
      setDescription(accounts[index].description);
      setBalance(accounts[index].balance);
      setSavingInitDate(accounts[index].savingInitDate);
      setSavingTargetDate(accounts[index].savingTargetDate);
      setSavingAmount(accounts[index].savingInitialAmount);
      setSavingTargetAmount(accounts[index].savingTargetAmount);
      setSavingAmountFunc(accounts[index].savingAmountFunc);
      setSavingFrequency(accounts[index].savingFrequency);
    }
  }

  useEffect(() => {
    if (index !== undefined) {
      setInitialState();
    }
  }, [index]);

  async function processData() {
    const data = {
      name: name || undefined,
      description: description || undefined,
      balance: balance || undefined,
      bankId: type || undefined,
      savingInitialAmount: savingAmount || undefined,
      savingTargetAmount: savingTargetAmount || undefined,
      savingInitDate: savingInitDate || undefined,
      savingTargetDate: savingTargetDate || undefined,
      savingAmountFunc: savingAmountFunc || undefined,
      savingFrequency: savingFrequency || undefined,
    };

    if (index !== undefined) {
      updateTag(user.token, id, index, data);
    }
    setName('');
    setDescription('');
    close();
    changeUIIndex(undefined);
  }

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      PaperComponent={PaperComponent}
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        Edit Account
      </DialogTitle>
      <DialogContent>
        <TextField
          className={classes.transactionTargetTextField}
          margin="dense"
          label="Account Name"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          fullWidth
        />
        <AccountTypeSelect
          label="Account type"
          value={type}
          handleChange={(e) => { setType(e.target.value); }}
        />
        <TextField
          className={classes.transactionTargetTextField}
          margin="dense"
          label="Account Description"
          type="text"
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
          }}
          fullWidth
        />
        {
          type === 'piggybank' && <>
            <TextField
              required
              margin="dense"
              id="balance"
              label="Balance"
              type="number"
              value={balance}
              onChange={(e) => {
                setBalance(e.target.value);
              }}
              fullWidth
            />
            <MuiPickersUtilsProvider utils={DayJsUtils} className={classes.dateSelector}>
              <KeyboardDatePicker
                margin="normal"
                className={classes.savingInitDate}
                label="Savings start date"
                format="DD/MM/YYYY"
                value={savingInitDate}
                onChange={(date) => {
                  setSavingInitDate(date);
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
              <KeyboardDatePicker
                margin="normal"
                className={classes.savingTargetDate}
                label="Savings end date"
                format="DD/MM/YYYY"
                value={savingTargetDate}
                onChange={(date) => {
                  setSavingTargetDate(date);
                }}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
            <TextField
              required
              className={classes.savingFrequency}
              margin="dense"
              id="savingFrequency"
              label="Saving Frequency, e.g.: 1w"
              type="text"
              value={savingFrequency}
              onChange={(e) => {
                setSavingFrequency(e.target.value);
              }}
            />
            <TextField
              required
              className={classes.savingAmountFunc}
              margin="dense"
              id="savingAmountFunc"
              label="Saving Expression, e.g.: n+1"
              type="text"
              value={savingAmountFunc}
              onChange={(e) => {
                setSavingAmountFunc(e.target.value);
              }}
            />
            <TextField
              required
              className={classes.savingAmount}
              margin="dense"
              id="savingAmount"
              label="Saving amount"
              type="number"
              value={savingAmount}
              onChange={(e) => {
                setSavingAmount(e.target.value);
              }}
            />
            <TextField
              required
              className={classes.savingTargetAmount}
              margin="dense"
              id="savingTargetAmount"
              label="Saving target amount"
              type="number"
              value={savingTargetAmount}
              onChange={(e) => {
                setSavingTargetAmount(e.target.value);
              }}
            />
            <SavingsChart
              serie={ calculateSavingSeries(
                parseFloat(savingAmount),
                parseFloat(savingTargetAmount),
                savingInitDate,
                savingTargetDate,
                savingFrequency,
                savingAmountFunc,
              ) } />
          </>
        }
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button color="primary" onClick={processData}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditAccountDialog.propTypes = {
  id: PropTypes.number,
  index: PropTypes.number,
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  user: PropTypes.object,
  updateTag: PropTypes.func,
  changeUIId: PropTypes.func,
  changeUIIndex: PropTypes.func,
  accounts: PropTypes.array,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  isOpen: state.account.editDialogOpen,
  contextMenuState: state.ui.contextMenuState,
  id: state.ui.contextMenuState.id,
  index: state.ui.contextMenuState.index,
  accounts: state.account.fetchedAccounts,
});

const mapDispatchToProps = (dispatch) => ({
  updateTag: (token, id, index, data) => {
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
  changeUIId: (id) => {
    dispatch(changeIdAction(id));
  },
  changeUIIndex: (index) => {
    dispatch(changeIndexAction(index));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditAccountDialog);
