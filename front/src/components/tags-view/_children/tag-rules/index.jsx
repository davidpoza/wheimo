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
import i18n from 'utils/i18n';

// own
import useStyles from './styles';
import withLoader from '../../../../hocs/with-loader';
import TagRulesItem from '../tag-rules-item';
import CreateTagRuleInput from '../create-tag-rule-input';

function TagRules({
  rules, tagId, tagIndex, lng,
}) {
  const classes = useStyles();

  useEffect(() => {

  }, []);

  return (
    <>
      <TableContainer component={Paper} className={classes.root}>
        <Table className={classes.table} size="small" aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell align="left" className={classes.tableHead}></TableCell>
              <TableCell align="left" className={classes.tableHead}>{i18n.t('editTag.ruletype', { lng })}</TableCell>
              <TableCell align="left" className={classes.tableHead}>{i18n.t('editTag.ruleValue', { lng })}</TableCell>
              <TableCell align="right" className={classes.tableHead}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              rules?.map((rule, index) => <TagRulesItem
                key={index}
                name={index+1}
                type={rule.type}
                value={rule.value}
                currentRules={rules.map((r) => r.id)}
                tagId={tagId}
                tagIndex={tagIndex}
                ruleId={rule.id}
              />)
            }
          </TableBody>
        </Table>
      </TableContainer>
      <CreateTagRuleInput tagId={tagId} tagIndex={tagIndex} currentRules={rules?.map((r) => r.id)} />
    </>
  );
}

TagRules.propTypes = {
  rules: PropTypes.array,
  tagId: PropTypes.number,
  tagIndex: PropTypes.number,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  lng: state.user?.current?.lang,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withLoader(TagRules));
