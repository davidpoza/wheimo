import React, { useEffect, useState, useCallback } from 'react';
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

// own
import useStyles from './styles';
import PiggyConfig from './_children/piggy-config';
import OpbkConfig from './_children/opbk-config';

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
  const [accessId, setAccessId] = useState();
  const [accessPassword, setAccessPassword] = useState();
  const [settings, setSettings] = useState();

  function handleClose() {
    changeUIIndex(undefined);
    changeUIId(undefined);
    close();
  }

  const setInitialState = useCallback(() => {
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
      setAccessId(accounts[index].accessId);
      setAccessPassword(accounts[index].accessPassword);
      setSettings(accounts[index].settings);
    }
  }, [
    setName,
    setType,
    setDescription,
    setBalance,
    setSavingInitDate,
    setSavingTargetDate,
    setSavingAmount,
    setSavingTargetAmount,
    setSavingAmountFunc,
    setSavingFrequency,
    setAccessId,
    setAccessPassword,
    setSettings,
    accounts,
    index,
  ]);

  useEffect(() => {
    if (index !== undefined) {
      setInitialState();
    }
  }, [setInitialState, index]);

  async function processData() {
    console.log('-->', settings);
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
      accessId: accessId || undefined,
      accessPassword: accessPassword || undefined,
      settings: settings || undefined,
    };

    if (index !== undefined) {
      updateTag(user.token, id, index, data);
    }
    setName('');
    setDescription('');
    setAccessId('');
    setAccessPassword('');
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
          label="Account Identifier"
          inputProps={{ maxLength: 6 }}
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
        {
          type === 'piggybank'
            && <PiggyConfig
              savingInitDate={savingInitDate}
              setSavingInitDate={setSavingInitDate}
              savingTargetDate={savingTargetDate}
              setSavingTargetDate={setSavingTargetDate}
              savingFrequency={savingFrequency}
              setSavingFrequency={setSavingFrequency}
              savingAmountFunc={savingAmountFunc}
              setSavingAmountFunc={setSavingAmountFunc}
              savingAmount={savingAmount}
              setSavingAmount={setSavingAmount}
              savingTargetAmount={savingTargetAmount}
              setSavingTargetAmount={setSavingTargetAmount}
            />
        }
        {
          type === 'opbk'
            && <OpbkConfig
              accessId={accessId}
              setAccessId={setAccessId}
              accessPassword={accessPassword}
              setAccessPassword={setAccessPassword}
              settings={settings}
              setSettings={setSettings}
            />
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
