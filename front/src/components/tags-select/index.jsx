import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

// own
import useStyles from './styles';
import {
  fetchAll as fetchTagsAction,
} from '../../actions/tag';

function TagsSelect({
  user, label, handleOnChange, limitTags, value, fetchTags, fetchedTags,
}) {
  const classes = useStyles();

  useEffect(() => {
    fetchTags(user.token);
  }, [user, fetchTags]);

  return (
    <Autocomplete
      value={value}
      className={classes.root}
      size="small"
      multiple
      limitTags={limitTags}
      id="tags"
      options={fetchedTags}
      getOptionLabel={(option) => option.name}
      onChange={handleOnChange}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
        />
      )}
    />
  );
}

TagsSelect.propTypes = {
  value: PropTypes.array,
  limitTags: PropTypes.number,
  user: PropTypes.object,
  label: PropTypes.string,
  handleOnChange: PropTypes.func,
  fetchTags: PropTypes.func,
  fetchedTags: PropTypes.array,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  fetchedTags: state.tag.fetchedTags,
});

const mapDispatchToProps = (dispatch) => ({
  fetchTags: (token) => {
    dispatch(fetchTagsAction(token))
      .catch((error) => {
        console.log(error.message);
      });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TagsSelect);
