import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Autocomplete from '@material-ui/lab/Autocomplete';
import TextField from '@material-ui/core/TextField';

// own
import useStyles from './styles';
import { fetchAll as fetchAllTags } from '../../api-client/tag';

function TagsSelect({
  user, label, handleOnChange,
}) {
  const classes = useStyles();
  const [tags, setTags] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchAllTags(user.token);
        setTags(data);
      } catch (error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, [user]);

  return (
    <Autocomplete
        multiple
        id="tags"
        options={tags}
        getOptionLabel={(option) => option.name}
        onChange={handleOnChange}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label={label}
          />
        )}
      />
  );
}

TagsSelect.propTypes = {
  user: PropTypes.object,
  label: PropTypes.string,
  values: PropTypes.array,
  handleOnChange: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
});

export default connect(mapStateToProps)(TagsSelect);
