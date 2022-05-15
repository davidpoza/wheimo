import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// own
import i18n from 'utils/i18n';
import {
  remove as removeTransactionAction,
  createEditDialogOpen as openTransactionDialogAction,
  mergeDialogClose as mergeDialogCloseAction,
  mergeDialogOpen as mergeDialogOpenAction,
  taggingDialogOpen as openTaggingDialogAction,
} from 'actions/transaction';
import {
  remove as removeTagAction,
  editDialogOpen as openEditTagDialogAction,
} from 'actions/tag';
import {
  remove as removeAccountAction,
  editDialogOpen as openEditAccountDialogAction,
  fixBalancesDialogOpen as fixBalancesDialogOpenAction,
} from 'actions/account';
import {
  contextMenuChangePosition as changePositionAction,
  contextMenuChangeId as changeIdAction,
  contextMenuChangeIndex as changeIndexAction,
} from 'actions/ui';
import {
  showSuccessMessage as showSuccessMessageAction,
} from 'actions/messages';
import { copyToClipboard } from 'utils/utilities';
import config from 'utils/config';
import useStyles from './styles';

function OperationDropdown({
  changeId,
  changeIndex,
  changePosition,
  closeMergeDialog,
  contextMenuState,
  entity = 'transaction',
  lng,
  openAccountDialog,
  openMergeDialog,
  openTagDialog,
  openTaggingDialog,
  openTransactionDialog,
  openFixBalancesDialog,
  removeAccount,
  removeTag,
  removeTransaction,
  showSuccessMessage,
  transactions,
  user,
}) {
  const classes = useStyles();
  const selectedTransactions = transactions
    ?.map((t, i) => ({
      ...t,
      index: i,
    }))
    ?.filter(t => t.checked);

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
      showSuccessMessage(i18n.t('successMessages.linkCopied', {lng}));
    }
    close();
  }

  function handleRemove() {
    switch (entity) {
      case 'transaction':
        if (selectedTransactions.length > 0) {
          removeTransaction(user.token, selectedTransactions.map(t => t.id), selectedTransactions.map(t => t.index));
        } else {
          removeTransaction(user.token, contextMenuState.id, contextMenuState.index);
        }
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

  function handleTag() {
    close();
    openTaggingDialog();
  }

  function handleFixBalances() {
    openFixBalancesDialog();
    changePosition(null, null);
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
        entity === 'transaction' && selectedTransactions.length <= 1 && (
          <MenuItem className={classes.item} onClick={handleCopyLink}>
            {i18n.t('opMenu.copyLink', {lng})}
          </MenuItem>
        )
      }
      {
        entity === 'transaction' && selectedTransactions.length > 0 && (
          <MenuItem className={classes.item} onClick={handleTag}>
            {i18n.t('opMenu.tag', {lng})} { selectedTransactions.length > 0 && `(${selectedTransactions.length})`}
          </MenuItem>
        )
      }
      {
        entity === 'transaction' && selectedTransactions.length <= 1 && (
          <MenuItem className={classes.item} onClick={handleMerge}>
            {i18n.t('opMenu.merge', {lng})}
          </MenuItem>
        )
      }
      {
        selectedTransactions.length <= 1
          && <MenuItem className={classes.item} onClick={handleEdit}>
          {i18n.t('opMenu.edit', {lng})}
        </MenuItem>
      }
      <MenuItem className={classes.item} onClick={handleRemove}>
        {i18n.t('opMenu.delete', {lng})} { selectedTransactions.length > 0 && `(${selectedTransactions.length})`}
      </MenuItem>
      <MenuItem className={classes.item} onClick={handleFixBalances}>
        {i18n.t('opMenu.fixBalances', {lng})}
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
  openFixBalancesDialog: PropTypes.func,
  openTaggingDialog: PropTypes.func,
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
  openFixBalancesDialog: () => {
    dispatch(fixBalancesDialogOpenAction());
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
  openTaggingDialog: () => {
    dispatch(openTaggingDialogAction());
  },
  showSuccessMessage: (msg) => {
    dispatch(showSuccessMessageAction(msg));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationDropdown);
