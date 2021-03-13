import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// own
import useStyles from './styles';
import {
  remove as removeAction,
  contextMenuChangePosition as changePositionAction,
  contextMenuChangeId as changeIdAction,
  contextMenuChangeIndex as changeIndexAction,
  createEditDialogOpen as openAction,
} from '../../actions/transaction';

function OperationDropdown({
  remove, user, changePosition, changeId, changeIndex, contextMenuState, openDialog,
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
    remove(user.token, contextMenuState.id, contextMenuState.index);
    close();
  }

  function handleEdit() {
    changePosition(null, null);
    openDialog();
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
  contextMenuState: PropTypes.object,
  user: PropTypes.object,
  remove: PropTypes.func,
  changePosition: PropTypes.func,
  changeId: PropTypes.func,
  changeIndex: PropTypes.func,
  openDialog: PropTypes.func,
};

const mapStateToProps = (state) => ({
  loading: state.transaction.isLoading,
  contextMenuState: state.transaction.contextMenuState,
  user: state.user.current,
  error: state.user.error,
  errorMessage: state.user.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  remove: (token, id, index) => {
    dispatch(removeAction(token, id, index))
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
  openDialog: () => {
    dispatch(openAction());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationDropdown);
