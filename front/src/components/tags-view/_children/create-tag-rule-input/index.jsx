import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';
import AddBoxIcon from '@material-ui/icons/AddBox';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import i18n from 'utils/i18n';

// own
import useStyles from './styles';
import {
  update as updateAction,
} from '../../../../actions/tag';
import * as ruleApi from '../../../../api-client/rule';

function CreateTagRuleInput({
  user, updateTag, currentRules, tagId, tagIndex, lng,
}) {
  const classes = useStyles();

  const [type, setType] = useState('');
  const [value, setValue] = useState('');
  const [error, setError] = useState(true);

  const checkErrors = useCallback(() => {
    if (type === '' || value === '') {
      setError(true);
    } else {
      setError(false);
    }
  }, [type, value]);

  useEffect(() => {
    checkErrors();
  }, [checkErrors]);

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
        renderValue={(value) =>
          value?.length
            ? Array.isArray(value)
              ? value.join(', ')
              : value
            : i18n.t('editTag.ruleTypeSelectPlaceholder', {lng})
        }
        onChange={(e) => {
          setType(e.target.value);
        }}
        variant="outlined"
        className={classes.typeSelect}
        value={type}>
        <MenuItem value="emitterName">{i18n.t('editTag.types.emitterName', {lng})}</MenuItem>
        <MenuItem value="receiverName">{i18n.t('editTag.types.receiverName', {lng})}</MenuItem>
        <MenuItem value="description">{i18n.t('editTag.types.description', {lng})}</MenuItem>
        <MenuItem value="isExpense">{i18n.t('editTag.types.isExpense', {lng})}</MenuItem>
        <MenuItem value="amount">{i18n.t('editTag.types.amount', {lng})}</MenuItem>
        <MenuItem value="card">{i18n.t('editTag.types.card', {lng})}</MenuItem>
        <MenuItem value="isReceipt">{i18n.t('editTag.types.isReceipt', {lng})}</MenuItem>
        <MenuItem value="account">{i18n.t('editTag.types.account', {lng})}</MenuItem>
        <MenuItem value="currency">{i18n.t('editTag.types.currency', {lng})}</MenuItem>
        <MenuItem value="bankId">{i18n.t('editTag.types.bankId', {lng})}</MenuItem>
      </Select>
      <TextField
        id="tagName"
        size="small"
        variant="outlined"
        value={value}
        placeholder={i18n.t('editTag.ruleValueSelectPlaceholder', {lng})}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        onKeyUp={onEnterKeyPress}
      />
      <Button
        variant="outlined"
        className={classes.createButton}
        onClick={add}
        disabled={error}
        startIcon={<AddBoxIcon />}
      >
        {i18n.t('editTag.newRule', {lng})}
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
  lng: state.user?.current?.lang,
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
