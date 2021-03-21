import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import DeleteIcon from '@material-ui/icons/Delete';
import IconButton from '@material-ui/core/IconButton';

// own
import useStyles from './styles';
import {
  update as updateAction,
} from '../../../../actions/tag';
import * as ruleApi from '../../../../api-client/rule';

function TagRulesItem({
  user, name, value, type, tagId, tagIndex, currentRules, ruleId, updateTag,
}) {
  const classes = useStyles();

  useEffect(() => {
  }, []);

  async function deleteRule() {
    updateTag(user.token, tagId, tagIndex, { rules: currentRules.filter((r) => r !== ruleId) });
    await ruleApi.remove(user.token, ruleId);
  }

  return (
    <TableRow key={name} className={classes.root}>
      <TableCell align="left" component="th" scope="row">
        {name}
      </TableCell>
      <TableCell align="right">{type}</TableCell>
      <TableCell align="right">{value}</TableCell>
      <TableCell align="right">
        <IconButton
          className={classes.deleteButton}
          color="primary"
          title="Delete rule"
          onClick={deleteRule}
        >
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  );
}

TagRulesItem.propTypes = {
  currentRules: PropTypes.arrayOf(PropTypes.number),
  name: PropTypes.string,
  ruleId: PropTypes.number,
  tagId: PropTypes.number,
  tagIndex: PropTypes.number,
  type: PropTypes.string,
  updateTag: PropTypes.func,
  user: PropTypes.object,
  value: PropTypes.string,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
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

export default connect(mapStateToProps, mapDispatchToProps)(TagRulesItem);
