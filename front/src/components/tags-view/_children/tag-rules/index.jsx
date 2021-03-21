import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

// own
import useStyles from './styles';
import withLoader from '../../../../hocs/with-loader';
import TagRulesItem from '../tag-rules-item';
import CreateTagRuleInput from '../create-tag-rule-input';

function TagRules({
  rules, tagId, tagIndex,
}) {
  const classes = useStyles();

  useEffect(() => {

  }, []);

  return (
    <TableContainer component={Paper} className={classes.root}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell align="left" className={classes.tableHead}>Rule name</TableCell>
            <TableCell align="right" className={classes.tableHead}>Type</TableCell>
            <TableCell align="right" className={classes.tableHead}>Value</TableCell>
            <TableCell align="right" className={classes.tableHead}></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            rules.map((rule, index) => <TagRulesItem
              key={index}
              name={rule.name}
              type={rule.type}
              value={rule.value}
              currentRules={rules.map((r) => r.id)}
              tagId={tagId}
              tagIndex={tagIndex}
              ruleId={rule.id}
            />)
          }
          <CreateTagRuleInput tagId={tagId} tagIndex={tagIndex} currentRules={rules.map((r) => r.id)} />
        </TableBody>
      </Table>
    </TableContainer>
  );
}

TagRules.propTypes = {
  rules: PropTypes.array,
  tagId: PropTypes.number,
  tagIndex: PropTypes.number,
};

const mapStateToProps = (state) => ({
  user: state.user.current,

});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withLoader(TagRules));
