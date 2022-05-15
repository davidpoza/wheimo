import React, { useEffect, useState, useCallback } from 'react';
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
import { fixBalances } from 'api-client/account';
import withIsMobile from 'hocs/with-is-mobile.jsx';
import ConditionalWrapper from 'shared/conditional-wrapper';
import {
  fixBalancesDialogClose as closeAction,
  fixBalancesDialogOpen as openAction,
} from 'actions/account';
import {
  contextMenuChangeIndex as changeIndexAction,
  contextMenuChangeId as changeIdAction,
} from 'actions/ui';
import useStyles from './styles';


function PaperComponent(props) {
  return (
    <ConditionalWrapper
      condition={!props.isMobile}
      ElementType={Draggable}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </ConditionalWrapper>
  );
}

function FixBalancesDialog({
  close,
  id,
  index,
  isOpen,
  lng,
  isMobile,
  user,
}) {
  const classes = useStyles();
  const [initialBalance, setInitialBalance] = useState();

  function handleClose() {
    close();

  }

  async function processData() {
    fixBalances(user.token, id, initialBalance);
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
      PaperProps={{ isMobile }}
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {i18n.t('fixBalances.title', { lng })}
        </div>
      </DialogTitle>
      <DialogContent className={classes.root}>
        <p>{i18n.t('fixBalances.description', { lng })} {id}</p>
        <TextField
          className={classes.transactionTargetTextField}
          margin="dense"
          label={i18n.t('fixBalances.initialBalance', { lng })}
          type="number"
          value={initialBalance}
          onChange={(e) => {
            setInitialBalance(e.target.value);
          }}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {i18n.t('transactionDetails.cancel', { lng })}
        </Button>
        <Button onClick={processData} color="primary">
          {
            index !== undefined
              ? i18n.t('transactionDetails.save', { lng })
              : i18n.t('transactionDetails.add', { lng })
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
}

FixBalancesDialog.propTypes = {
  changeUIId: PropTypes.func,
  changeUIIndex: PropTypes.func,
  close: PropTypes.func,
  id: PropTypes.number,
  index: PropTypes.number,
  isOpen: PropTypes.bool,
  open: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  contextMenuState: state.ui.contextMenuState,
  id: state.ui.contextMenuState.id,
  index: state.ui.contextMenuState.index,
  isOpen: state.account.fixBalancesDialogOpen,
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
});

export default connect(mapStateToProps, mapDispatchToProps)(withIsMobile(FixBalancesDialog));
