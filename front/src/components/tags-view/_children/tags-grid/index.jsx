import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import Pagination from '@material-ui/lab/Pagination';

// own
import { getInnerHeight } from 'utils/utilities';
import TagsGridItem from '../tags-grid-item';
import useStyles from './styles';
import {
  setPage as setPageAction,
} from 'actions/tag';

function TagsGrid({
  user, tags = [], page = 1, setPage,
}) {
  const classes = useStyles();
  const listRef = useRef();
  const [pageSize, setPageSize] = useState(0);
  const ITEM_SIZE = 60;

  useEffect(() => {
    if (listRef?.current) {
      setPageSize(Math.floor(getInnerHeight(listRef?.current) / ITEM_SIZE));
    }
  }, [tags]);

  function handlePageChange(event, value) {
    setPage(value);
  }

  const chunk = (tags && pageSize)
  ? tags.slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
  : [];

  const pagesCount = Math.floor(tags.length / pageSize);

  return (
    <div className={classes.root}>
      {
        chunk && tags
          && <>
          {
            tags.length > 0
              ? <List ref={listRef} className={classes.list}>
                  {
                    chunk.map((tag, index) => (
                      <TagsGridItem
                        index={index}
                        id={tag.id}
                        indexInStore={(page - 1) * pageSize + index}
                        key={tag.id}
                        name={tag.name}
                        rules={tag.rules}
                      />
                    ))
                  }
                </List>
              : <div>
                  No results found
                </div>
          }
          <div className={classes.bottomBar}>
            <div className={classes.resultsCounter}>
              { tags.length !== 0 && `${tags.length} results found`}
            </div>
            <Pagination
              className={classes.pagination}
              count={Math.ceil(tags.length / pageSize)}
              onChange={handlePageChange}
              hidePrevButton={pagesCount === 0}
              hideNextButton={pagesCount === 0}
            />
          </div>
        </>
      }
    </div>
  );
}

TagsGrid.propTypes = {
  user: PropTypes.object,
  tags: PropTypes.array,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  tags: state.tag.fetchedTags,
  page: state.tag.page,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  setPage: (p) => {
    dispatch(setPageAction(p));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TagsGrid);
