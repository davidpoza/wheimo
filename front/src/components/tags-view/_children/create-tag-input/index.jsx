import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import i18n from 'utils/i18n';

// own
import {
  create as createAction,
} from 'actions/tag';
import useStyles from './styles';

function CreateTagInput({
  user, tags = [], create, lng,
}) {
  const classes = useStyles();

  const [tagName, setTagName] = useState('');
  const [error, setError] = useState(true);

  const checkErrors = useCallback(() => {
    if (tagName === '') {
      setError(true);
    } else {
      setError(false);
    }
  }, [setError, tagName]);

  useEffect(() => {
    checkErrors();
  }, [checkErrors]);

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
        placeholder={i18n.t('tags.placeholder', { lng })}
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
  lng: state.user?.current?.lang,
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
