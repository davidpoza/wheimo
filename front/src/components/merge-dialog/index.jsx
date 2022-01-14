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


// own
import { fetchAll } from 'api-client/transaction';
import useStyles from './styles';
import {
  addAttachment as addAttachmentAction,
  create as createAction,
  mergeDialogOpen as openAction,
  mergeDialogClose as closeAction,
  update as updateAction,
} from '../../actions/transaction';
import {
  contextMenuChangeIndex as changeIndexAction,
  contextMenuChangeId as changeIdAction,
} from '../../actions/ui';
import Tags from '../tags';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

function MergeDialog({
  changeUIId,
  changeUIIndex,
  close,
  id,
  index,
  isOpen,
  transactions,
  updateTransaction,
  user,
}) {
  const classes = useStyles();
  const [lastTransactions, setLastTransactions] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchAll(user.token, { from: dayjs().subtract(30, 'day').format('YYYY-MM-DD'), sort: 'desc' });
        setLastTransactions(res);
      } catch(err) {

      }
    })();
  }, []);



  function handleClose() {
    changeUIId(undefined);
    changeUIIndex(undefined);
    close();
  }

  function handleOnKeyDown(e) {
    if(e.keyCode===27) { //esc
      e.preventDefault();
      handleClose();
    } else if(e.keyCode===13 && e.ctrlKey) {
      e.preventDefault();
      processData();
    }
  }

  async function processData() {
    // const data = {
    //   comments: comments || undefined,
    // };

    // updateTransaction(user.token, id, index, data);
    changeUIIndex(undefined);
    // clearForm();
    close();
  }

  function printTransactionIdentifier(t) {
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
        Merge transaction into another
      </DialogTitle>
      <DialogContent className={classes.root}>
        <FormControl className={classes.formControl} style={{minWidth: '100%' }}>
          <InputLabel id="demo-mutiple-name-label">Select the transaction you want to merge into</InputLabel>
          <Select
            autoWidth
            labelId="demo-mutiple-name-label"
            id="demo-mutiple-name"
            value={lastTransactions}
            // onChange={handleChange}
            input={<Input/>}
            // MenuProps={MenuProps}
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
          Cancel
        </Button>
        <Button onClick={processData} color="primary">
          Save Changes
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
  isUploadingAttachment: state.transaction.isUploadingAttachment,
  user: state.user.current,
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
  changeUIId: (id) => {
    dispatch(changeIdAction(id));
  },
  changeUIIndex: (index) => {
    dispatch(changeIndexAction(index));
  },
  addAttachment: (token, formData) => {
    dispatch(addAttachmentAction(token, formData));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(MergeDialog);
