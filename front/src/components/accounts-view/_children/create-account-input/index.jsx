import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

// own
import useStyles from './styles';
import {
  create as createAction,
} from '../../../../actions/account';

function CreateAccountInput({
  user, tags = [], create,
}) {
  const classes = useStyles();

  const [accountName, setAccountName] = useState('');
  const [error, setError] = useState(true);

  const checkErrors = useCallback(() => {
    if (accountName === '') {
      setError(true);
    } else {
      setError(false);
    }
  }, [accountName]);

  useEffect(() => {
    checkErrors();
  }, [checkErrors]);

  function add() {
    create(user.token, { name: accountName, number: 'xxx', bankId: 'wallet' });
    setAccountName('');
  }

  async function onFormSubmit(e) {
    e.preventDefault();
    if (!error) add();
  }

  return (
    <form noValidate onSubmit={onFormSubmit} className={classes.root}>
      <TextField
        className={classes.input}
        id="tagName"
        type="text"
        value={accountName}
        autoFocus={true}
        placeholder="Type a new account"
        onChange={(e) => {
          setAccountName(e.target.value);
        }}
        fullWidth
        variant="outlined"
      />
      <IconButton
        className={classes.createButton}
        color="primary"
        title="Create tag"
        onClick={add}
        disabled={error}
      >
        <AddBoxIcon fontSize="large" />
      </IconButton>
    </form>
  );
}

CreateAccountInput.propTypes = {
  user: PropTypes.object,
  tags: PropTypes.array,
  create: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  tags: state.tag.fetchedTags,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  create: (token, data) => {
    dispatch(createAction(token, data))
      .catch((error) => {
        console.log(error.message);
      });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateAccountInput);
