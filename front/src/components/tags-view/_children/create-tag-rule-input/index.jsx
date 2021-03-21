import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import AddBoxIcon from '@material-ui/icons/AddBox';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';

// own
import useStyles from './styles';
import {
  update as updateAction,
} from '../../../../actions/tag';
import * as ruleApi from '../../../../api-client/rule';

function CreateTagRuleInput({
  user, updateTag, currentRules, tagId, tagIndex,
}) {
  const classes = useStyles();

  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [value, setValue] = useState('');

  useEffect(() => {

  }, []);

  async function add() {
    const rule = await ruleApi.create(user.token, { name, type, value });
    updateTag(user.token, tagId, tagIndex, { rules: [...currentRules, rule.id] });
    setName('');
    setType('');
    setValue('');
  }

  async function onEnterKeyPress(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      add();
    }
  }

  return (
    <TableRow className={classes.root}>
      <TableCell align="left" scope="row">
        <input
          className={classes.input}
          id="tagName"
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      </TableCell>
      <TableCell align="right" scope="row">
        <Select
          onChange={(e) => { setType(e.target.value); }}
          variant="outlined"
          className={classes.typeSelect}
          value={type}
        >
          <MenuItem value="emitterName">Emitter name</MenuItem>
          <MenuItem value="receiverName">Receiver name</MenuItem>
          <MenuItem value="description">Description</MenuItem>
          <MenuItem value="isExpense">It&apos;s an expense</MenuItem>
          <MenuItem value="amount">Amount</MenuItem>
          <MenuItem value="card">Card</MenuItem>
          <MenuItem value="isReceipt">It&apos;s a receipt</MenuItem>
          <MenuItem value="account">Account</MenuItem>
          <MenuItem value="currency">Currency</MenuItem>
          <MenuItem value="bankId">Bank</MenuItem>
        </Select>
      </TableCell>
      <TableCell align="right" scope="row" className={classes.valueCell}>
        <input
          className={classes.inputWithSubmit}
          id="tagName"
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          onKeyUp={onEnterKeyPress}
        />
        <IconButton
          className={classes.createButton}
          color="primary"
          title="Create rule"
          onClick={add}
        >
          <AddBoxIcon
            fontSize="large"
          />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

CreateTagRuleInput.propTypes = {
  user: PropTypes.object,
  updateTag: PropTypes.func,
  tagId: PropTypes.number,
  tagIndex: PropTypes.number,
  currentRules: PropTypes.arrayOf(PropTypes.number),
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  tags: state.tag.fetchedTags,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  updateTag: (token, id, index, data) => {
    dispatch(updateAction(token, id, index, data))
      .catch((error) => {
        console.log(error.message);
      });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateTagRuleInput);
