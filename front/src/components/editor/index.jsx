import React, { useState, useEffect, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

// own
import withIsMobile from 'hocs/with-is-mobile.jsx';
import useStyles from './styles';

function Editor({
  content, setContent, isMobile,
}) {
  const [edit, setEdit] = useState(false);
  const classes = useStyles();
  const textareaRef = useRef();

  const handleKeyDown = useCallback((e) => {
    if (!edit && e.keyCode===69) {
      e.preventDefault();
      setEdit(true);
    }
  }, [edit]);

  useEffect(() => {
    if (edit && textareaRef) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(textareaRef.current.value.length,textareaRef.current.value.length);
    }
  }, [edit, textareaRef]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown])

  function handleDoubleClick() {
    setEdit(!edit);
  }

  return (
    <div
      className={classes.root}
      onKeyDown={handleKeyDown}
      onDoubleClick={!isMobile && handleDoubleClick}
      onClick={isMobile && handleDoubleClick}
    >
    {
      edit
        ? <TextField
            color="primary"
            className={classes.editor}
            inputRef={textareaRef}
            multiline
            margin="dense"
            id="comments"
            type="text"
            value={content}
            rows={10}
            variant="outlined"
            onChange={(e) => { setContent(e.target.value); }}
            fullWidth
          />
        : <ReactMarkdown className={content ? classes.preview : classes.empty } plugins={[gfm]} >
            { content || 'double click to edit' }
          </ReactMarkdown>
    }
    </div>
  );
}

export default withIsMobile(Editor);

Editor.propTypes = {
  content: PropTypes.string,
  setContent: PropTypes.func,
};
