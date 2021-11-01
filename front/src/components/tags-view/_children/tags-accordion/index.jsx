import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// own
import AccordionItem from '../tags-accordion-item';
import useStyles from './styles';
import { azOrder } from '../../../../utils/utilities';

function TagsAccordion({
  user, tags = [],
}) {
  const classes = useStyles();
  const ref = useRef();
  console.log();

  useEffect(() => {

  }, []);

  return (
    <div className={classes.root} style={{ maxHeight: `${ref.current?.offsetHeight - 10}px` }} ref={ref}>
      {
        tags.sort(azOrder).map((tag, index) => (
          <AccordionItem
            id={tag.id}
            indexInStore={index}
            key={tag.id}
            name={tag.name}
            rules={tag.rules}
          />
        ))
      }
    </div>
  );
}

TagsAccordion.propTypes = {
  user: PropTypes.object,
  tags: PropTypes.array,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  tags: state.tag.fetchedTags,
  loading: state.transaction.isLoading,
  error: state.transaction.error,
  errorMessage: state.transaction.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({

});

export default connect(mapStateToProps, mapDispatchToProps)(TagsAccordion);
