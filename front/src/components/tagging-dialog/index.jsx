import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import i18n from 'utils/i18n';

import TagSelect from 'components/tags-select';

// own
import {
  taggingDialogOpen as openAction,
  taggingDialogClose as closeAction,
  remove as removeTransactionAction,
  applySpecificTags as applySpecificTagsAction,
} from 'actions/transaction';
import {
  contextMenuChangeIndex as changeIndexAction,
  contextMenuChangeId as changeIdAction,
} from 'actions/ui';
import {
  showSuccessMessage as showSuccessMessageAction,
} from 'actions/messages';
import useStyles from './styles';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

function TaggingDialog({
  id,
  index,
  transactions,
  changeUIId,
  changeUIIndex,
  close,
  isOpen,
  user,
  lng,
  applyTags,
  showSuccessMessage
}) {
  const classes = useStyles();
  const [tags, setTags] = useState([]);
  const selectedTransactions = transactions
    ?.filter(t => t.checked)
    ?.map((t) => t.id);

  function handleClose() {
    changeUIId(undefined);
    changeUIIndex(undefined);
    setTags([]);
    close();
  }

  function handleOnKeyDown(e) {
    if(e.keyCode===27) { //esc
      e.preventDefault();
      handleClose();
    } else if(e.keyCode===13) {
      e.preventDefault();
      processData();
    }
  }

  function processData() {
    const tagIds = tags.map(tag => tag.id);
    applyTags(user.token, selectedTransactions, tagIds);
    changeUIIndex(undefined);
    close();
    showSuccessMessage(i18n.t('successMessages.applySpecificTags', { lng }));
  }

  function handleOnChange(e, value) {
    setTags(value);
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
        {i18n.t('taggingDialog.title', { lng })}
      </DialogTitle>
      <DialogContent className={classes.root}>
        <TagSelect label={i18n.t('taggingDialog.label', { lng })} handleOnChange={handleOnChange} />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {i18n.t('taggingDialog.cancel', { lng })}
        </Button>
        <Button onClick={processData} color="primary">
          {i18n.t('taggingDialog.proceed', { lng })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

TaggingDialog.propTypes = {
  changeUIId: PropTypes.func,
  changeUIIndex: PropTypes.func,
  close: PropTypes.func,
  id: PropTypes.number,
  index: PropTypes.number,
  isOpen: PropTypes.bool,
  open: PropTypes.func,
  transactions: PropTypes.array,
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  contextMenuState: state.ui.contextMenuState,
  id: state.ui.contextMenuState.id,
  index: state.ui.contextMenuState.index,
  isOpen: state.transaction.taggingDialogOpen,
  transactions: state.transaction.fetchedTransactions,
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
  showSuccessMessage: (msg) => {
    dispatch(showSuccessMessageAction(msg));
  },
  applyTags: (token, ids, tagIds) => {
    dispatch(applySpecificTagsAction(token, { ids, tagIds }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TaggingDialog);
