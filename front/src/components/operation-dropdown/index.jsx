import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// own
import i18n from 'utils/i18n';
import useStyles from './styles';
import {
  remove as removeTransactionAction,
  createEditDialogOpen as openTransactionDialogAction,
  mergeDialogClose as mergeDialogCloseAction,
  mergeDialogOpen as mergeDialogOpenAction,
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
import { copyToClipboard } from 'utils/utilities';
import config from 'utils/config';

function OperationDropdown({
  lng,
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
  openMergeDialog,
  closeMergeDialog,
  transactions,
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

  async function handleCopyLink() {
    if (contextMenuState.index !== undefined && contextMenuState.id !== undefined) {
      const t = transactions[contextMenuState.index];
      let text = '';
      if (t.description) text =  `${t.description.substr(0,30)}...`;
      else if(t.emitterName) text = `${t.emitterName.substr(0,30)}...`;
      else if(t.receiverName) text = `${t.receiverName.substr(0,30)}...`;
      await copyToClipboard(`[#${contextMenuState.id} ${text} ${t.amount}€](${config.APP_HOST}/transactions/${contextMenuState.id})`);
    }
    close();
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

  function handleMerge() {
    changePosition(null, null);
    switch (entity) {
      case 'transaction':
        openMergeDialog();
        break;
      default: return;
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
          ? {top: contextMenuState.mouseY, left: contextMenuState.mouseX}
          : undefined
      }>
      {
        entity === 'transaction' && (
          <MenuItem className={classes.item} onClick={handleCopyLink}>
            {i18n.t('opMenu.copyLink', {lng})}
          </MenuItem>
        )
      }
      {
        entity === 'transaction' && (
          <MenuItem className={classes.item} onClick={handleMerge}>
            {i18n.t('opMenu.merge', {lng})}
          </MenuItem>
        )
      }
      <MenuItem className={classes.item} onClick={handleEdit}>
        {i18n.t('opMenu.edit', {lng})}
      </MenuItem>
      <MenuItem className={classes.item} onClick={handleRemove}>
        {i18n.t('opMenu.delete', {lng})}
      </MenuItem>
    </Menu>
  );
}

OperationDropdown.propTypes = {
  transactions: PropTypes.array,
  changeId: PropTypes.func,
  changeIndex: PropTypes.func,
  changePosition: PropTypes.func,
  closeMergeDialog: PropTypes.func,
  contextMenuState: PropTypes.object,
  entity: PropTypes.string,
  openAccountDialog: PropTypes.func,
  openMergeDialog: PropTypes.func,
  openTagDialog: PropTypes.func,
  openTransactionDialog: PropTypes.func,
  removeAccount: PropTypes.func,
  removeTag: PropTypes.func,
  removeTransaction: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  loading: state.transaction.isLoading,
  transactions: state.transaction.fetchedTransactions,
  contextMenuState: state.ui.contextMenuState,
  user: state.user.current,
  lng: state.user?.current?.lang,
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
  openMergeDialog: () => {
    dispatch(mergeDialogOpenAction());
  },
  closeMergeDialog: () => {
    dispatch(mergeDialogCloseAction());
  },
  openTagDialog: () => {
    dispatch(openEditTagDialogAction());
  },
  openAccountDialog: () => {
    dispatch(openEditAccountDialogAction());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationDropdown);
