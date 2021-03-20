import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// own
import {
  fetchAll as fetchTagsAction,
} from '../../actions/tag';
import TagsAccordion from './_children/tags-accordion';
import OperationDropdown from '../operation-dropdown';
import CreateTagInput from './_children/create-tag-input';
import withLoader from '../../hocs/with-loader';
import useStyles from './styles';

function TagsView({
  user, fetchTags,
}) {
  const classes = useStyles();

  useEffect(() => {
    fetchTags(user.token);
  }, []);

  return (
    <div className={classes.root}>
      <OperationDropdown entity="tag" />
      <TagsAccordion />
      <CreateTagInput />
    </div>
  );
}

TagsView.propTypes = {
  user: PropTypes.object,
  fetchTags: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  fetchTags: (token) => {
    dispatch(fetchTagsAction(token))
      .catch((error) => {
        console.log(error.message);
      });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withLoader(TagsView));
