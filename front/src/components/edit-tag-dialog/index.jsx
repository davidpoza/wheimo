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

// own
import TagRules from 'components/tags-view/_children/tag-rules/index.jsx'
import useStyles from './styles';
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
        Edit tag
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
            }}
          >
            Apply
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
            Untag
          </Button>
        </div>

        <TextField
          className={classes.transactionTargetTextField}
          margin="dense"
          label="Tag Name"
          type="text"
          value={tagName}
          onChange={(e) => {
            setTagName(e.target.value);
          }}
          fullWidth
        />
        <h2>Rules</h2>
        <TagRules rules={tags?.[index]?.rules} tagId={id} tagIndex={index} />
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
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(EditTagDialog);
