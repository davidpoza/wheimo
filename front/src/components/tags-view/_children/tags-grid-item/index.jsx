import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import LabelIcon from '@material-ui/icons/Label';

// own
import useStyles from './styles';
import {
  contextMenuChangePosition as changePositionAction,
  contextMenuChangeId as changeIdAction,
  contextMenuChangeIndex as changeIndexAction,
} from '../../../../actions/ui';
import {
  apply as applyAction,
  untag as untagAction,
} from '../../../../actions/tag';

function TagsGridItem({
  user, name, id, rules, changeId, changePosition, changeIndex, indexInStore, apply, untagAll
}) {
  const classes = useStyles();

  useEffect(() => {

  }, []);

  function handleContextMenu(e) {
    e.preventDefault();
    changeId(id);
    changePosition(e.clientX - 2, e.clientY - 4);
    changeIndex(indexInStore);
  }

  return (
    <div className={classes.root} onContextMenu={handleContextMenu}>
      <LabelIcon className={classes.icon} />
      <Typography>
        {name} {
          rules.length > 0 && <span className={classes.rulesCounter}>{`(${rules.length} rules)`}</span>
        }
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
