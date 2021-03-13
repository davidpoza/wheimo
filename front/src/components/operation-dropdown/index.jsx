import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// own
import useStyles from './styles';
import { remove as removeAction } from '../../actions/transaction';

function OperationDropdown({
  handleClose, contextMenuState, handleOnContextMenu, contextMenuId, remove, user,
}) {
  const classes = useStyles();

  function handleContextMenu(e) {
    handleOnContextMenu(e, contextMenuId);
  }

  function handleRemove() {
    remove(user.token, contextMenuId, contextMenuState.index);
    handleClose();
  }

  return (
    <Menu
      keepMounted
      open={contextMenuState.mouseY !== null}
      onClose={handleClose}
      anchorReference="anchorPosition"
      onContextMenu={handleContextMenu}
      anchorPosition={
        contextMenuState.mouseY !== null && contextMenuState.mouseX !== null
          ? { top: contextMenuState.mouseY, left: contextMenuState.mouseX }
          : undefined
      }
    >
      <MenuItem className={classes.item} onClick={handleClose}>Duplicate</MenuItem>
      <MenuItem className={classes.item} onClick={handleClose}>Edit</MenuItem>
      <MenuItem className={classes.item} onClick={handleRemove}>Delete</MenuItem>
    </Menu>
  );
}

OperationDropdown.propTypes = {
  user: PropTypes.object,
  remove: PropTypes.func,
  contextMenuId: PropTypes.number,
  contextMenuState: PropTypes.bool,
  handleOnContextMenu: PropTypes.func,
  handleClose: PropTypes.func,
};

const mapStateToProps = (state) => ({
  loading: state.transaction.isLoading,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(OperationDropdown);
