import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

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

  const [type, setType] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState(true);

  function checkErrors() {
    if (type === '' || value === '') {
      setError(true);
    } else {
      setError(false);
    }
  }

  useEffect(() => {
    checkErrors();
  }, [type, value]);

  async function add() {
    const uuid = uuidv4();
    const rule = await ruleApi.create(user.token, { name: uuid, type, value });
    updateTag(user.token, tagId, tagIndex, { rules: [...currentRules, rule.id] });
    setType('');
    setValue('');
  }

  async function onEnterKeyPress(e) {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (!error) add();
    }
  }

  return (
    <div className={classes.root}>
      <Select
        displayEmpty={true}
        renderValue={value => value?.length ? Array.isArray(value) ? value.join(', ') : value : 'Select type of rule'}
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
      <TextField
        id="tagName"
        size="small"
        variant="outlined"
        value={value}
        placeholder="Type a rule using correct syntax"
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyUp={onEnterKeyPress}
      />
      <Button
        variant="outlined"
        className={classes.createButton}
        title="Create rule"
        onClick={add}
        disabled={error}
        startIcon={<AddBoxIcon />}
      >
        New Rule
      </Button>
    </div>
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
