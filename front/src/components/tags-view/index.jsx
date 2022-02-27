import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// own
import {
  fetchAll as fetchTagsAction,
} from '../../actions/tag';
import EditTagDialog from '../edit-tag-dialog';
import TagsGrid from './_children/tags-grid';
import OperationDropdown from '../operation-dropdown';
import CreateTagInput from './_children/create-tag-input';
import withLoader from '../../hocs/with-loader';
import withMessages from '../../hocs/with-messages';
import useStyles from './styles';

function TagsView({
  user, fetchTags,
}) {
  const classes = useStyles();

  useEffect(() => {
    fetchTags(user.token);
  }, [fetchTags, user.token]);

  return (
    <div className={classes.root}>
      <CreateTagInput />
      <OperationDropdown entity="tag" />
      <TagsGrid />
      <EditTagDialog />
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
    dispatch(fetchTagsAction(token, { orderBy: 'name', sort: 'asc' }))
      .catch((error) => {
        console.log(error.message);
      });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withLoader(withMessages(TagsView)));
