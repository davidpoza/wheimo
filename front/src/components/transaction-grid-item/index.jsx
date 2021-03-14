import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import dayjs from 'dayjs';

// own
import Tags from '../tags';
import useStyles from './styles';
import {
  remove as removeAction,
  contextMenuChangePosition as changePositionAction,
  contextMenuChangeId as changeIdAction,
  contextMenuChangeIndex as changeIndexAction,
  update as updateAction,
} from '../../actions/transaction';

function TransactionGridItem({
  account,
  amount,
  changeId,
  changeIndex,
  changePosition,
  comments,
  date,
  description,
  emitterName,
  favourite,
  handleToggle,
  id,
  index,
  indexInStore,
  receiverName,
  tags,
  updateFavourite,
  user,
  valueDate,
}) {
  const classes = useStyles();
  const labelId = `checkbox-list-label-${index}`;

  function handleContextMenu(e) {
    e.preventDefault();
    changeId(id);
    changePosition(e.clientX - 2, e.clientY - 4);
    changeIndex(indexInStore);
  }

  function toggleFavourite(e) {
    e.preventDefault();
    updateFavourite(user.token, id, indexInStore, favourite);
  }

  return (
    <ListItem
      key={index}
      role={undefined}
      dense
      button
      onClick={handleToggle(index)}
      className={classes.root}
      onContextMenu={handleContextMenu}
      disableTouchRipple
    >
      <ListItemIcon>
        <Checkbox
          edge="start"
          checked={true}
          tabIndex={-1}
          disableRipple
          inputProps={{ 'aria-labelledby': labelId }}
        />
      </ListItemIcon>
      <div className={classes.content}>
        <div className={classes.firstLine}>
          <span className={`${classes.icon} ${amount > 0 ? classes.down : classes.up}`}>
            { amount > 0 ? <ExpandMoreIcon /> : <ExpandLessIcon /> }
          </span>
          <span className={classes.star}>
          {
            favourite
              ? <StarIcon className={classes.activeStar} fontSize="small" onClick={toggleFavourite} />
              : <StarBorderIcon fontSize="small" onClick={toggleFavourite} />
          }
          </span>
          <span className={classes.amount}>
            {`${amount}€`}
          </span>
          <span className={classes.emitter}>
            {amount > 0 ? emitterName : receiverName}
          </span>
          <div className={classes.tags}>
            <Tags tags={tags} />
          </div>
          <div className={classes.date}>
            {dayjs(date).format('dddd DD, MMM YY')}
          </div>
        </div>
        <div className={classes.account}>
          {account}
        </div>
        <div className={classes.description}>
          {description}
        </div>

      </div>
    </ListItem>
  );
}

TransactionGridItem.propTypes = {
  account: PropTypes.string,
  amount: PropTypes.number,
  changeId: PropTypes.func,
  changeIndex: PropTypes.func,
  changePosition: PropTypes.func,
  comments: PropTypes.string,
  date: PropTypes.string,
  description: PropTypes.string,
  emitterName: PropTypes.string,
  favourite: PropTypes.bool,
  handleToggle: PropTypes.func,
  id: PropTypes.string,
  index: PropTypes.number,
  indexInStore: PropTypes.number,
  receiverName: PropTypes.string,
  tags: PropTypes.array,
  updateFavourite: PropTypes.func,
  user: PropTypes.object,
  valueDate: PropTypes.string,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
});

const mapDispatchToProps = (dispatch) => ({
  remove: (token, id, index) => {
    dispatch(removeAction(token, id, index))
      .catch((error) => {
        console.log(error.message);
      });
  },
  changePosition: (x, y) => {
    dispatch(changePositionAction(x, y));
  },
  changeId: (id) => {
    dispatch(changeIdAction(id));
  },
  changeIndex: (index) => {
    dispatch(changeIndexAction(index));
  },
  updateFavourite: (token, id, index, value) => {
    dispatch(updateAction(token, id, index, { favourite: !value }))
      .catch((error) => {
        console.log(error.message);
      });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(TransactionGridItem);
