import React from 'react';
import { connect } from 'react-redux';

// material ui
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

// own
import {
  hideMessages as hideMessagesAction,
} from 'actions/messages';
import {
  hideMessages as hideMessagesFromTransactionsAction,
} from 'actions/transaction';
import {
  hideMessages as hideMessagesFromAccountAction,
} from 'actions/account';
import {
  hideMessages as hideMessagesFromTagAction,
} from 'actions/tag';
import {
  hideMessages as hideMessagesFromUserAction,
} from 'actions/user';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme) => ({
  root: {
    marginTop: theme.spacing(14),
  },
  success: {
    backgroundColor: "#66bb6a"
  },
  error: {
    backgroundColor: "#e91e63"
  }
}));


const mapStateToProps = (state) => ({
  errorMessage: state.messages.error ||
    state.transaction.errorMessage ||
    state.tag.errorMessage ||
    state.account.errorMessage ||
    state.user.errorMessage,
  successMessage: state.messages.success ||
    state.transaction.successMessage ||
    state.tag.successMessage ||
    state.account.successMessage ||
    state.user.successMessage
});

const mapDispatchToProps = (dispatch) => ({
  hideMessages: () => {
    dispatch(hideMessagesAction());
    dispatch(hideMessagesFromTransactionsAction());
    dispatch(hideMessagesFromAccountAction());
    dispatch(hideMessagesFromTagAction());
    dispatch(hideMessagesFromUserAction());
  },
});

const Messages = connect(mapStateToProps, mapDispatchToProps)(
  ({ errorMessage, successMessage, hideMessages }) => {
    const classes = useStyles();
    return (
      (errorMessage || successMessage)
        ? <Snackbar
          className={classes.root}
          style={{zIndex: 999999}}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'center',
          }}
          open={errorMessage || successMessage}
          autoHideDuration={2000}
          onClose={() => {
            hideMessages();
          }}
        >
          <Alert
            className={errorMessage ? classes.error : classes.success}
            severity={errorMessage ? 'error' : 'success'}
            sx={{width: '100%'}}>
            {errorMessage || successMessage}
          </Alert>
        </Snackbar>
      : null
    );
  }
);

/* eslint-disable react/prop-types */
const withMessages = (Component) => ({
  ...rest
}) => {
  return <>
    <Messages />
    <Component {...rest} />
  </>
};


export default withMessages;