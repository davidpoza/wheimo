import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LabelIcon from '@material-ui/icons/Label';
import Button from '@material-ui/core/Button';

// own
import useStyles from './styles';
import {
  contextMenuChangePosition as changePositionAction,
  contextMenuChangeId as changeIdAction,
  contextMenuChangeIndex as changeIndexAction,
} from '../../../../actions/ui';
import {
  apply as applyAction,
  untag as untagAction,
} from '../../../../actions/tag';
import TagRules from '../tag-rules';

function AccordionItem({
  user, name, id, rules, changeId, changePosition, changeIndex, indexInStore, apply, untagAll
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
          onContextMenu={handleContextMenu}
          classes={{
            root: classes.summary,
            content: classes.summaryContent
          }}
        >
          <LabelIcon className={classes.icon} />
          <div className={classes.body}>
            <Typography>
              {name} {
                rules.length > 0 && <span className={classes.rulesCounter}>{`(${rules.length} rules)`}</span>
              }
            </Typography>
            <div>
              <Button
                color="primary"
                variant="contained"
                size="small"
                className={classes.button}
                onClick={(e) => {
                  e.stopPropagation();
                  apply(user.token, id);
                }}
              >
                Apply
              </Button>
              <Button
                color="primary"
                variant="contained"
                size="small"
                className={classes.button}
                onClick={(e) => {
                  e.stopPropagation();
                  untagAll(user.token, id);
                }}
              >
                Untag
              </Button>
            </div>
          </div>

        </AccordionSummary>
        <AccordionDetails>
          <TagRules rules={rules} tagId={id} tagIndex={indexInStore} />
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
  user: state.user.current,
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
  apply: (token, tagId) => {
    dispatch(applyAction(token, tagId));
  },
  untagAll: (token, tagId) => {
    dispatch(untagAction(token, tagId));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AccordionItem);
