import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';

// own
import useStyles from './styles';
import withLoader from '../../../../hocs/with-loader';

function TagRulesItem({
  name, value, type,
}) {
  const classes = useStyles();

  useEffect(() => {
  }, []);

  return (
    <TableRow key={name} className={classes.root}>
      <TableCell align="left" component="th" scope="row">
        {name}
      </TableCell>
      <TableCell align="right">{type}</TableCell>
      <TableCell align="right">{value}</TableCell>
    </TableRow>
  );
}

TagRulesItem.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  type: PropTypes.string,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(withLoader(TagRulesItem));
