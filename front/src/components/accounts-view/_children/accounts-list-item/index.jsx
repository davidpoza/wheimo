import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import LinearProgress from '@material-ui/core/LinearProgress';

// own
import useStyles from './styles';
import {
  contextMenuChangePosition as changePositionAction,
  contextMenuChangeId as changeIdAction,
  contextMenuChangeIndex as changeIndexAction,
} from 'actions/ui';

function AccountsListItem({
  name,
  index,
  id,
  balance,
  description,
  number,
  bankId,
  changeId,
  changePosition,
  changeIndex,
  indexInStore,
  savingTargetAmount,
}) {
  const classes = useStyles();
  const numberRef = useRef();
  useEffect(() => {

  }, []);

  function handleContextMenu(e) {
    e.preventDefault();
    changeId(id);
    changePosition(e.clientX - 2, e.clientY - 4);
    changeIndex(indexInStore);
  }

  function selectAndCopy(e) {
    const range = document.createRange();
    range.selectNodeContents(numberRef.current);
    const currentSelection = window.getSelection();
    currentSelection.removeAllRanges();
    currentSelection.addRange(range);
    document.execCommand('copy');
  }

  function formatBankId(bkId) {
    switch (bkId) {
      case 'opbk':
        return 'Open Bank';
      case 'piggybank':
        return 'Piggy Bank';
      default:
        return 'Wallet';
    }
  }

  return (
    <>
      <ListItem
        className={classes.root}
        style={{borderTop: index === 0 ? 'none' : 'auto'}}
        onContextMenu={handleContextMenu}
      >
        <ListItemIcon>
          <AccountBalanceIcon />
        </ListItemIcon>
        <ListItemText
          primary={name}
          secondary={
            <React.Fragment>
              <Typography
                component="span"
                variant="body2"
                className={classes.inline}
                color="textPrimary">
                {description}
              </Typography>
            </React.Fragment>
          }
        />
        <div>
          <div className={classes.number}>
            {formatBankId(bankId)}
            {!['Wallet', 'Piggy Bank'].includes(formatBankId(bankId)) && (
              <span>
                :{' '}
                <span onClick={selectAndCopy} ref={numberRef}>
                  {number}
                </span>
              </span>
            )}
            {formatBankId(bankId) === 'Piggy Bank' && (
              <LinearProgress
                className={classes.savingProgress}
                variant="determinate"
                value={(balance * 100) / savingTargetAmount}
              />
            )}
          </div>
          <div
            className={`${classes.balance} ${
              balance > 0 ? classes.positiveBalance : classes.negativeBalance
            }`}>
            {balance}€
          </div>
        </div>
      </ListItem>
    </>
  );
}

AccountsListItem.propTypes = {
  changeId: PropTypes.func,
  changeIndex: PropTypes.func,
  changePosition: PropTypes.func,
  id: PropTypes.number,
  indexInStore: PropTypes.number,
  balance: PropTypes.number,
  savingTargetAmount: PropTypes.number,
  bankId: PropTypes.number,
  name: PropTypes.string,
  number: PropTypes.string,
  description: PropTypes.string,
};

const mapStateToProps = (state) => ({

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
});

export default connect(mapStateToProps, mapDispatchToProps)(AccountsListItem);
