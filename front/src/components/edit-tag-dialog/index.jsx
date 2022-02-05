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
import i18n from 'utils/i18n';

// own
import TagRules from 'components/tags-view/_children/tag-rules/index.jsx'
import useStyles from './styles';
import {
  showSuccessMessage as showSuccessMessageAction,
} from '../../actions/messages';

import {
  editDialogOpen as openAction,
  editDialogClose as closeAction,
  apply as applyAction,
  untag as untagAction,
  update as updateAction,
} from '../../actions/tag';
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

function EditTagDialog({
  id,
  index,
  tags,
  isOpen,
  close,
  user,
  updateTag,
  changeUIId,
  changeUIIndex,
  indexInStore,
  apply,
  untagAll,
  lng,
  showSuccessMessage
}) {
  const classes = useStyles();
  const [tagName, setTagName] = useState('');

  function handleClose() {
    changeUIIndex(undefined);
    changeUIId(undefined);
    close();
  }

  function setInitialState() {
    if (tags[index]) {
      setTagName(tags[index].name);
    }
  }

  useEffect(() => {
    if (index !== undefined) {
      setInitialState();
    }
  }, [index]);

  async function processData() {
    const data = {
      name: tagName || undefined,
    };

    if (index !== undefined) {
      updateTag(user.token, id, index, data);
    }
    setTagName('');
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
        {i18n.t('editTag.title', { lng })}
      </DialogTitle>
      <DialogContent>
        <div className={classes.opButtons}>
          <Button
            color="primary"
            variant="contained"
            size="small"
            className={classes.button}
            onClick={(e) => {
              e.stopPropagation();
              apply(user.token, id);
              showSuccessMessage(i18n.t('successMessages.applyTags', { lng }));
            }}
          >
            {i18n.t('editTag.apply', { lng })}
          </Button>
          <Button
            color="primary"
            variant="contained"
            size="small"
            className={classes.button}
            onClick={(e) => {
              e.stopPropagation();
              untagAll(user.token, id);
            }}
          >
            {i18n.t('editTag.untag', { lng })}
          </Button>
        </div>

        <TextField
          className={classes.transactionTargetTextField}
          margin="dense"
          label={i18n.t('editTag.tagName', {lng})}
          type="text"
          value={tagName}
          onChange={(e) => {
            setTagName(e.target.value);
          }}
          fullWidth
        />
        <h2>{i18n.t('editTag.rules', { lng })}</h2>
        <TagRules rules={tags?.[index]?.rules} tagId={id} tagIndex={index} />
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {i18n.t('editTag.cancel', { lng })}
        </Button>
        <Button color="primary" onClick={processData}>
          {i18n.t('editTag.save', { lng })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

EditTagDialog.propTypes = {
  id: PropTypes.number,
  index: PropTypes.number,
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  user: PropTypes.object,
  updateTag: PropTypes.func,
  changeUIId: PropTypes.func,
  changeUIIndex: PropTypes.func,
  tags: PropTypes.array,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  isOpen: state.tag.editDialogOpen,
  contextMenuState: state.ui.contextMenuState,
  id: state.ui.contextMenuState.id,
  index: state.ui.contextMenuState.index,
  tags: state.tag.fetchedTags,
  lng: state.user?.current?.lang,
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
  apply: (token, tagId) => {
    dispatch(applyAction(token, tagId));
  },
  untagAll: (token, tagId) => {
    dispatch(untagAction(token, tagId));
  },
  showSuccessMessage: (msg) => {
    dispatch(showSuccessMessageAction(msg));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditTagDialog);
