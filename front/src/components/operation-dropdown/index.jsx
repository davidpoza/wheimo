import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

// own
import useStyles from './styles';

export default function OperationDropdown({
  handleClose, contextMenuState, handleOnContextMenu, contextMenuId,
}) {
  const classes = useStyles();

  function handleContextMenu(e) {
    handleOnContextMenu(e, contextMenuId);
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
      <MenuItem onClick={handleClose}>Duplicate</MenuItem>
      <MenuItem onClick={handleClose}>Edit</MenuItem>
      <MenuItem onClick={handleClose}>Delete</MenuItem>
    </Menu>
  );
}

OperationDropdown.propTypes = {
  contextMenuId: PropTypes.number,
  contextMenuState: PropTypes.bool,
  handleOnContextMenu: PropTypes.func,
  handleClose: PropTypes.func,
};
