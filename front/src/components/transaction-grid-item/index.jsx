import React from 'react';
import Proptypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import Checkbox from '@material-ui/core/Checkbox';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import dayjs from 'dayjs';

// own
import Tags from '../tags';
import useStyles from './styles';

export default function TransactionGridItem({
  index,
  id,
  emitterName,
  receiverName,
  description,
  comments,
  date,
  valueDate,
  tags,
  amount,
  account,
  handleToggle,
  handleOnContextMenu,
}) {
  const classes = useStyles();
  const labelId = `checkbox-list-label-${index}`;

  function handleContextMenu(e) {
    handleOnContextMenu(e, id, index);
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
            {amount > 0 ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </span>
          <span className={classes.star}>
            <StarBorderIcon fontSize="small" />
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
  index: Proptypes.number,
  id: Proptypes.string,
  emitterName: Proptypes.string,
  receiverName: Proptypes.string,
  description: Proptypes.string,
  comments: Proptypes.string,
  date: Proptypes.string,
  valueDate: Proptypes.string,
  tags: Proptypes.array,
  amount: Proptypes.number,
  account: Proptypes.string,
  handleToggle: Proptypes.func,
  handleOnContextMenu: Proptypes.func,
};
