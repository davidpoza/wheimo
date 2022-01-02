import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';

// own
import useStyles from './styles';
import {
  create as createAction,
} from '../../../../actions/tag';

function CreateTagInput({
  user, tags = [], create,
}) {
  const classes = useStyles();

  const [tagName, setTagName] = useState('');
  const [error, setError] = useState(true);

  function checkErrors() {
    if (tagName === '') {
      setError(true);
    } else {
      setError(false);
    }
  }

  useEffect(() => {
    checkErrors();
  }, [tagName]);

  function add() {
    create(user.token, { name: tagName });
    setTagName('');
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
        value={tagName}
        autoFocus={true}
        placeholder="Type a new tag"
        onChange={(e) => {
          setTagName(e.target.value);
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
        <AddBoxIcon
          fontSize="large"
        />
      </IconButton>
    </form>
  );
}

CreateTagInput.propTypes = {
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateTagInput);
