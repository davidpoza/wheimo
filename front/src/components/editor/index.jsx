import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

// own
import useStyles from './styles';

export default function Editor({
  content, setContent,
}) {
  const [edit, setEdit] = useState(false);
  const classes = useStyles();

  function handleDoubleClick() {
    setEdit(!edit);
  }
  return (
    <div
      className={classes.root}
      onDoubleClick={handleDoubleClick}
    >
    {
      edit
        ? <TextField
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

Editor.propTypes = {
  content: PropTypes.string,
  setContent: PropTypes.func,
};
