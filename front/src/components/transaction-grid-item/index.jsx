import React from 'react';
import { connect } from 'react-redux';
import removeMd from 'remove-markdown';
import PropTypes from 'prop-types';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StarIcon from '@material-ui/icons/Star';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import dayjs from 'dayjs';

// own
import Checkbox from 'shared/checkbox';
import withIsMobile from 'hocs/with-is-mobile.jsx';
import Tags from '../tags';
import useStyles from './styles';
import {
  remove as removeAction,
  toggleChecked as toggleCheckedAction,
  update as updateAction,
  detailsDialogOpen as openAction,
} from 'actions/transaction';
import {
  contextMenuChangePosition as changePositionAction,
  contextMenuChangeId as changeIdAction,
  contextMenuChangeIndex as changeIndexAction,
} from 'actions/ui';
import { formatAmount } from 'utils/utilities';
import constants from 'utils/constants';

function TransactionGridItem({
  accountBalance,
  accountDescription,
  accountIdentifier,
  amount,
  attachments,
  bankId,
  changeId,
  changeIndex,
  changePosition,
  checked,
  comments,
  date,
  description,
  emitterName,
  favourite,
  handleChangeFilter,
  id,
  index,
  indexInStore,
  isMobile,
  openDetailsDialog,
  receiverName,
  tags,
  toggleChecked,
  updateFavourite,
  user,
  valueDate,
}) {
  const classes = useStyles();
  const emitterReceiver = amount > 0 ? emitterName : receiverName;
  const emitterLimit = isMobile ? 26 : 26;
  const descriptionLimit = isMobile ? 26 : 60;
  const commentsLimit = isMobile ? 26 : 60;

  function handleContextMenu(e) {
    e.preventDefault();
    changeId(id);
    changePosition(e.clientX - 2, e.clientY - 4);
    changeIndex(indexInStore);
  }

  function handleOpenDetailsDialog() {
    changeId(id);
    changeIndex(indexInStore);
    openDetailsDialog();
  }

  function toggleFavourite(e) {
    e.stopPropagation();
    updateFavourite(user.token, id, indexInStore, favourite);
  }

  return (
    <ListItem
      key={index}
      role={undefined}
      dense
      button
      className={classes.root}
      style={{borderTop: index === 0 ? 'none' : 'auto'}}
      onContextMenu={handleContextMenu}
      disableTouchRipple
      onClick={() => {
        handleOpenDetailsDialog();
      }}
      onTap>
      <ListItemIcon className={classes.checkbox}>
        <Checkbox
          checked={checked}
          onClick={(e) => {
            toggleChecked(indexInStore);
          }}
        />
      </ListItemIcon>
      <div className={classes.content}>
        <div className={classes.firstLine}>
          {!isMobile && (
            <span
              className={`${classes.icon} ${
                amount > 0 ? classes.down : classes.up
              }`}>
              {amount > 0 ? <ExpandMoreIcon /> : <ExpandLessIcon />}
            </span>
          )}
          <span
            className={`${classes.amount} ${
              amount > 0 ? classes.down : classes.up
            }`}>
            {`${formatAmount(amount)}`}
          </span>
          {emitterReceiver && !isMobile && (
            <span className={classes.emitter}>
              {emitterReceiver?.substr(0, emitterLimit)?.toLowerCase()}
              {emitterReceiver.length > emitterLimit && <>...</>}
            </span>
          )}
          <div className={classes.tags}>
            <Tags tags={tags} handleChangeFilter={handleChangeFilter} />
          </div>
          {
            <div className={classes.attachments}>
              { attachments.length > 0 && <AttachFileIcon fontSize="small" /> }
            </div>
          }
          <div className={classes.date}>
            {isMobile
              ? dayjs(date).format('DD/MM')
              : dayjs(date).format('dddd DD, MMM YY')}
          </div>
          {!isMobile && (
            <span className={classes.star}>
              {favourite ? (
                <StarIcon
                  className={classes.activeStar}
                  fontSize="small"
                  onClick={toggleFavourite}
                />
              ) : (
                <StarBorderIcon fontSize="small" onClick={toggleFavourite} />
              )}
            </span>
          )}
        </div>
        <div className={classes.secondLine}>
          <div className={classes.description}>
            {
              description?.substr(0, descriptionLimit).toUpperCase() ||
                (isMobile &&
                  (emitterReceiver?.substr(0, emitterLimit)?.toUpperCase() ||
                    comments
                      ?.substr(0, commentsLimit)
                      .split('\n')?.[0]
                      ?.toUpperCase()))
            }
            {!isMobile && description?.length > 0 && comments && ' - '}
            {!isMobile &&
              removeMd(comments || '')
                ?.substr(0, commentsLimit)
                .split('\n')?.[0]
                ?.toUpperCase()}
          </div>
          <div className={classes.account}>
            {isMobile ? accountIdentifier : accountDescription}
            {bankId !== constants.BANK_ID_NORDIGEN && ` | `}
            {bankId !== constants.BANK_ID_NORDIGEN ? formatAmount(accountBalance, false) : null}
          </div>
        </div>
      </div>
    </ListItem>
  );
}

TransactionGridItem.propTypes = {
  accountBalance: PropTypes.number,
  accountDescription: PropTypes.string,
  accountIdentifier: PropTypes.string,
  amount: PropTypes.number,
  attachments: PropTypes.array,
  bankId: PropTypes.string,
  changeId: PropTypes.func,
  changeIndex: PropTypes.func,
  changePosition: PropTypes.func,
  checked: PropTypes.bool,
  comments: PropTypes.string,
  date: PropTypes.string,
  description: PropTypes.string,
  emitterName: PropTypes.string,
  favourite: PropTypes.bool,
  handleChangeFilter: PropTypes.func,
  id: PropTypes.number,
  index: PropTypes.number,
  indexInStore: PropTypes.number,
  openDetailsDialog: PropTypes.func,
  receiverName: PropTypes.string,
  tags: PropTypes.array,
  toggleChecked: PropTypes.func,
  updateFavourite: PropTypes.func,
  user: PropTypes.object,
  valueDate: PropTypes.string
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
  toggleChecked: (index) => {
    dispatch(toggleCheckedAction(index));
  },
  openDetailsDialog: () => {
    dispatch(openAction());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withIsMobile(TransactionGridItem));
