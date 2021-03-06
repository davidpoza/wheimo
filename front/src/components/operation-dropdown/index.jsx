import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// own
import useStyles from './styles';
import {
  remove as removeTransactionAction,
  createEditDialogOpen as openTransactionDialogAction,
} from '../../actions/transaction';
import {
  remove as removeTagAction,
  editDialogOpen as openEditTagDialogAction,
} from '../../actions/tag';
import {
  remove as removeAccountAction,
  editDialogOpen as openEditAccountDialogAction,
} from '../../actions/account';
import {
  contextMenuChangePosition as changePositionAction,
  contextMenuChangeId as changeIdAction,
  contextMenuChangeIndex as changeIndexAction,
} from '../../actions/ui';

function OperationDropdown({
  entity = 'transaction',
  removeTransaction,
  removeTag,
  removeAccount,
  user,
  changePosition,
  changeId,
  changeIndex,
  contextMenuState,
  openTransactionDialog,
  openAccountDialog,
  openTagDialog,
}) {
  const classes = useStyles();

  function handleContextMenu(e) {
    e.preventDefault();
    changePosition(e.clientX - 2, e.clientY - 4);
  }

  function close() {
    changePosition(null, null);
    changeId(undefined);
    changeIndex(undefined);
  }

  function handleRemove() {
    switch (entity) {
      case 'transaction':
        removeTransaction(user.token, contextMenuState.id, contextMenuState.index);
        break;
      case 'tag':
        removeTag(user.token, contextMenuState.id, contextMenuState.index);
        break;
      case 'account':
        removeAccount(user.token, contextMenuState.id, contextMenuState.index);
        break;
      default:
        removeTransaction(user.token, contextMenuState.id, contextMenuState.index);
    }
    close();
  }

  function handleEdit() {
    changePosition(null, null);
    switch (entity) {
      case 'transaction':
        openTransactionDialog();
        break;
      case 'tag':
        openTagDialog();
        break;
      case 'account':
        openAccountDialog();
        break;
      default:
        openTransactionDialog();
    }
  }

  return (
    <Menu
      keepMounted
      open={contextMenuState.mouseY !== null}
      onClose={close}
      anchorReference="anchorPosition"
      onContextMenu={handleContextMenu}
      anchorPosition={
        contextMenuState.mouseY !== null && contextMenuState.mouseX !== null
          ? { top: contextMenuState.mouseY, left: contextMenuState.mouseX }
          : undefined
      }
    >
      <MenuItem className={classes.item} onClick={close}>Duplicate</MenuItem>
      <MenuItem className={classes.item} onClick={handleEdit}>Edit</MenuItem>
      <MenuItem className={classes.item} onClick={handleRemove}>Delete</MenuItem>
    </Menu>
  );
}

OperationDropdown.propTypes = {
  entity: PropTypes.string,
  contextMenuState: PropTypes.object,
  user: PropTypes.object,
  removeTransaction: PropTypes.func,
  removeAccount: PropTypes.func,
  removeTag: PropTypes.func,
  changePosition: PropTypes.func,
  changeId: PropTypes.func,
  changeIndex: PropTypes.func,
  openTransactionDialog: PropTypes.func,
  openAccountDialog: PropTypes.func,
  openTagDialog: PropTypes.func,
};

const mapStateToProps = (state) => ({
  loading: state.transaction.isLoading,
  contextMenuState: state.ui.contextMenuState,
  user: state.user.current,
  error: state.user.error,
  errorMessage: state.user.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  removeTransaction: (token, id, index) => {
    dispatch(removeTransactionAction(token, id, index))
      .catch((error) => {
        console.log(error.message);
      });
  },
  removeTag: (token, id, index) => {
    dispatch(removeTagAction(token, id, index))
      .catch((error) => {
        console.log(error.message);
      });
  },
  removeAccount: (token, id, index) => {
    dispatch(removeAccountAction(token, id, index))
      .catch((error) => {
        console.log(error.message);
      });
  },
  changePosition: (x, y) => {
    dispatch(changePositionAction(x, y));
  },
  changeId: (id) => {
    dispatch(changeIdAction(id));
  },
  changeIndex: (index) => {
    dispatch(changeIndexAction(index));
  },
  openTransactionDialog: () => {
    dispatch(openTransactionDialogAction());
  },
  openTagDialog: () => {
    dispatch(openEditTagDialogAction());
  },
  openAccountDialog: () => {
    dispatch(openEditAccountDialogAction());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationDropdown);
