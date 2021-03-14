import React from 'react';
import { Editor as TinyMce } from '@tinymce/tinymce-react';
import PropTypes from 'prop-types';

class Editor extends React.Component {
  constructor(props) {
    super(props);
    this.handleEditorChange = this.handleEditorChange.bind(this);
  }

  handleEditorChange(content) {
    this.props.setContent(content);
  }

  render() {
    return (
      <TinyMce
        value={this.props.content}
        init={{
          height: 300,
          menubar: false,
          plugins: [
            'link lists paste textpattern',
          ],
          invalid_elements: 'strong,b,em,i,img,div,table,tr,td,th,script,iframe',
          toolbar: 'bold italic link bullist numlist',
          branding: false,
          paste_as_text: true,
        }}
        onEditorChange={this.handleEditorChange}
      />
    );
  }
}

export default Editor;

Editor.propTypes = {
  content: PropTypes.string,
  setContent: PropTypes.func,
};
