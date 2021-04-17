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
import dayjs from 'dayjs';

// own
import useStyles from './styles';
import Editor from '../editor';
import {
  create as createAction,
  update as updateAction,
  detailsDialogOpen as openAction,
  detailsDialogClose as closeAction,
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
  changeUIId,
  changeUIIndex,
}) {
  const classes = useStyles();
  const [comments, setComments] = useState('');
  const {
    description, amount, date, tags,
  } = transactions[index] || {};
  const account = transactions[index]?.account?.name;
  function setInitialState() {
    if (transactions[index]) {
      setComments(transactions[index]?.comments);
    }
  }

  function clearForm() {
    setComments('');
  }

  useEffect(() => {
    if (index !== undefined) {
      setInitialState();
    }
  }, [index]);

  function handleClose() {
    clearForm();
    changeUIId(undefined);
    changeUIIndex(undefined);
    close();
  }

  async function processData() {
    const data = {
      comments: comments || undefined,
    };

    updateTransaction(user.token, id, index, data);
    changeUIIndex(undefined);
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
      <DialogContent className={classes.root}>
        <Tags tags={tags} />
        <p className={classes.item}>
          <h2 className={classes.h2}>{account} </h2>
          <span>{amount}€</span>
        </p>
        <p className={classes.item}>
          <h2 className={classes.h2}>Date: </h2>
          <span>{dayjs(date).format('dddd DD MMM YYYY')}</span>
        </p>
        <p className={classes.item}>
          <h2 className={classes.h2}>Description: </h2>
          <span>{description}</span>
        </p>
        <h2 className={classes.h2}>Notes:</h2>
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
  changeUIId: PropTypes.func,
  changeUIIndex: PropTypes.func,
  transactions: PropTypes.array,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  isOpen: state.transaction.detailsDialogOpen,
  contextMenuState: state.ui.contextMenuState,
  id: state.ui.contextMenuState.id,
  index: state.ui.contextMenuState.index,
  transactions: state.transaction.fetchedTransactions,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsDialog);
