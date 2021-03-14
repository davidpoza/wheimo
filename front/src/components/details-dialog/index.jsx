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
import Editor from '../editor';
import {
  create as createAction,
  update as updateAction,
  detailsDialogOpen as openAction,
  detailsDialogClose as closeAction,
  contextMenuChangeId as changeIdAction,
  contextMenuChangeIndex as changeIndexAction,
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
  changeId,
  changeIndex,
}) {
  const classes = useStyles();
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');

  function setInitialState() {
    if (transactions[index]) {
      setComments(transactions[index]?.comments);
    }
  }

  function clearForm() {
    setDescription('');
    setComments('');
  }

  useEffect(() => {
    if (index !== undefined) {
      setInitialState();
    }
  }, [index]);

  function handleClose() {
    clearForm();
    changeId(undefined);
    changeIndex(undefined);
    close();
  }

  async function processData() {
    const data = {
      // description: description || undefined,
      comments: comments || undefined,
    };

    updateTransaction(user.token, id, index, data);
    clearForm();
    close();
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
        Transaction details
      </DialogTitle>
      <DialogContent>
        <Editor content={comments} setContent={ (_content) => { setComments(_content); }} />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={processData} color="primary">
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
  changeId: PropTypes.func,
  changeIndex: PropTypes.func,
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
  changeId: (id) => {
    dispatch(changeIdAction(id));
  },
  changeIndex: (index) => {
    dispatch(changeIndexAction(index));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsDialog);
