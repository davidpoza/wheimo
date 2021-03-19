import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddBoxIcon from '@material-ui/icons/AddBox';

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

  useEffect(() => {

  }, []);

  function add() {
    create(user.token, { name: tagName });
  }

  return (
    <div className={classes.root}>
      <input
        className={classes.input}
        id="tagName"
        type="text"
        value={tagName}
        onChange={(e) => {
          setTagName(e.target.value);
        }}
      />
       <AddBoxIcon
        fontSize="large"
        className={classes.icon}
        onClick={add}
       />
    </div>
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
