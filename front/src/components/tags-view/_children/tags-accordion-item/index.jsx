import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LabelIcon from '@material-ui/icons/Label';

// own
import useStyles from './styles';
import {
  contextMenuChangePosition as changePositionAction,
  contextMenuChangeId as changeIdAction,
  contextMenuChangeIndex as changeIndexAction,
} from '../../../../actions/ui';
import TagRules from '../tag-rules';

function AccordionItem({
  name, id, rules, changeId, changePosition, changeIndex, indexInStore,
}) {
  const classes = useStyles();

  useEffect(() => {

  }, []);

  function handleContextMenu(e) {
    e.preventDefault();
    changeId(id);
    changePosition(e.clientX - 2, e.clientY - 4);
    changeIndex(indexInStore);
  }

  return (
    <>
      <Accordion className={classes.root}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
          onContextMenu={handleContextMenu}
        >
          <LabelIcon className={classes.icon} />
          <Typography className={classes.heading}>{name} {rules.length > 0 && `(${rules.length} rules)`}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TagRules rules={rules} />
        </AccordionDetails>
      </Accordion>
    </>
  );
}

AccordionItem.propTypes = {
  changeId: PropTypes.func,
  changeIndex: PropTypes.func,
  changePosition: PropTypes.func,
  id: PropTypes.number,
  indexInStore: PropTypes.number,
  name: PropTypes.string,
  rules: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string,
    type: PropTypes.string,
    value: PropTypes.string,
  })),
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

export default connect(mapStateToProps, mapDispatchToProps)(AccordionItem);
