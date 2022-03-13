import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import LabelIcon from '@material-ui/icons/Label';
import i18n from 'utils/i18n';

// own
import {
  contextMenuChangePosition as changePositionAction,
  contextMenuChangeId as changeIdAction,
  contextMenuChangeIndex as changeIndexAction,
} from 'actions/ui';
import {
  apply as applyAction,
  untag as untagAction,
} from 'actions/tag';
import useStyles from './styles';

function TagsGridItem({
  user,
  name,
  id,
  index,
  rules,
  changeId,
  changePosition,
  changeIndex,
  indexInStore,
  apply,
  untagAll,
  lng,
}) {
  const classes = useStyles();

  useEffect(() => {}, []);

  function handleContextMenu(e) {
    e.preventDefault();
    changeId(id);
    changePosition(e.clientX - 2, e.clientY - 4);
    changeIndex(indexInStore);
  }

  return (
    <div
      className={classes.root}
      style={{borderTop: index === 0 ? 'none' : 'auto'}}
      onContextMenu={handleContextMenu}>
      <LabelIcon className={classes.icon} />
      <Typography>
        {name}{' '}
        {rules.length > 0 && (
          <span
            className={classes.rulesCounter}>{`(${rules.length} ${i18n.t('tags.rules', { lng })})`}</span>
        )}
      </Typography>
    </div>
  );
}

TagsGridItem.propTypes = {
  changeId: PropTypes.func,
  changeIndex: PropTypes.func,
  changePosition: PropTypes.func,
  id: PropTypes.number,
  indexInStore: PropTypes.number,
  name: PropTypes.string,
  rules: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
  })),
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  lng: state.user?.current?.lang,
});

const mapDispatchToProps = (dispatch) => ({
  changePosition: (x, y) => {
    dispatch(changePositionAction(x, y));
  },
  changeId: (id) => {
    dispatch(changeIdAction(id));
  },
  changeIndex: (index) => {
    dispatch(changeIndexAction(index));
  },
  apply: (token, tagId) => {
    dispatch(applyAction(token, tagId));
  },
  untagAll: (token, tagId) => {
    dispatch(untagAction(token, tagId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(TagsGridItem);
