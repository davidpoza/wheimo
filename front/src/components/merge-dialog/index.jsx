import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import dayjs from 'dayjs';
import i18n from 'utils/i18n';

// own
import { fetchAll, update } from 'api-client/transaction';
import useStyles from './styles';
import {
  mergeDialogOpen as openAction,
  mergeDialogClose as closeAction,
} from '../../actions/transaction';
import {
  contextMenuChangeIndex as changeIndexAction,
  contextMenuChangeId as changeIdAction,
} from '../../actions/ui';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

function MergeDialog({
  id,
  transactions,
  changeUIId,
  changeUIIndex,
  close,
  isOpen,
  user,
  lng
}) {
  const classes = useStyles();
  const [lastTransactions, setLastTransactions] = useState([]);
  const [targetTransactionId, setTargetTransactionId] = useState('');
  const currentTransaction = transactions && transactions.find(t => t.id === id);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchAll(user.token, { from: dayjs().subtract(30, 'day').format('YYYY-MM-DD'), sort: 'desc' });
        setLastTransactions(res);
      } catch(err) {

      }
    })();
  }, [user.token]);

  function handleClose() {
    changeUIId(undefined);
    changeUIIndex(undefined);
    setTargetTransactionId('');
    close();
  }

  async function handleOnKeyDown(e) {
    if(e.keyCode===27) { //esc
      e.preventDefault();
      handleClose();
    } else if(e.keyCode===13) {
      e.preventDefault();
      await processData();
    }
  }

  async function processData() {
    await update(user.token, targetTransactionId, {
      comments: currentTransaction.comments,
      tags: currentTransaction.tags
    });
    changeUIIndex(undefined);
    close();
  }

  function printTransactionIdentifier(t) {
    if (!t) return '';
    let ret = `${dayjs(t.date).format('DD-MM-YYYY')} | ${t.amount}€`;
    if (t.description) {
      ret += ` | ${t.description.substr(0,20)}...`;
    } else if (t.emitterName) {
      ret += ` | ${t.emitterName.substr(0.20)}...`;
    } else if (t.receiverName) {
      ret += ` | ${t.receiverName.substr(0,20)}...`;
    }
    return ret;
  }

  function handleOnChange(e) {
    setTargetTransactionId(e.target.value);
  }

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      PaperComponent={PaperComponent}
      onKeyDown={handleOnKeyDown}
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        {i18n.t('mergeDialog.title', { lng })}
      </DialogTitle>
      <DialogContent className={classes.root}>
        <FormControl className={classes.formControl} style={{minWidth: '100%' }}>
          <InputLabel id="target-transation-id-label">{i18n.t('mergeDialog.label', { lng })}</InputLabel>
          <Select
            autoWidth
            labelId="target-transation-id-label"
            id="target-transation-id-select"
            value={targetTransactionId}
            onChange={handleOnChange}
            input={<Input/>}
          >
            {lastTransactions.map((t) => (
              <MenuItem key={t.id} value={t.id}>
                {printTransactionIdentifier(t)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {i18n.t('mergeDialog.cancel', { lng })}
        </Button>
        <Button onClick={processData} color="primary">
          {i18n.t('mergeDialog.proceed', { lng })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

MergeDialog.propTypes = {
  addAttachment: PropTypes.func,
  changeUIId: PropTypes.func,
  changeUIIndex: PropTypes.func,
  close: PropTypes.func,
  createTransaction: PropTypes.func,
  id: PropTypes.number,
  index: PropTypes.number,
  isOpen: PropTypes.bool,
  isUploadingAttachment: PropTypes.bool,
  open: PropTypes.func,
  transactions: PropTypes.array,
  updateTransaction: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  contextMenuState: state.ui.contextMenuState,
  id: state.ui.contextMenuState.id,
  index: state.ui.contextMenuState.index,
  isOpen: state.transaction.mergeDialogOpen,
  transactions: state.transaction.fetchedTransactions,
  isUploadingAttachment: state.transaction.isUploadingAttachment,
  user: state.user.current,
  lng: state.user?.current?.lang,
});

const mapDispatchToProps = (dispatch) => ({
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

export default connect(mapStateToProps, mapDispatchToProps)(MergeDialog);
