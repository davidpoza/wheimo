import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';

// own
import useStyles from './styles';
import {
  contextMenuChangePosition as changePositionAction,
  contextMenuChangeId as changeIdAction,
  contextMenuChangeIndex as changeIndexAction,
} from '../../../../actions/ui';

function AccountsListItem({
  name, id, balance, description, number, bankId, changeId, changePosition, changeIndex, indexInStore,
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
        return 'Wallet';
      default:
        return 'Wallet';
    }
  }

  return (
    <>
      <ListItem className={classes.root} onContextMenu={handleContextMenu}>
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
                color="textPrimary"
              >
                {description}
              </Typography>
            </React.Fragment>
          }
        />
        <div>
          <div className={classes.number}>
            { formatBankId(bankId) }
            { formatBankId(bankId) !== 'Wallet'
              && <span>
                : <span onClick={selectAndCopy} ref={numberRef}>{number}</span>
              </span>
            }
          </div>
          <div className={`${classes.balance} ${balance > 0 ? classes.positiveBalance : classes.negativeBalance}`}>
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
