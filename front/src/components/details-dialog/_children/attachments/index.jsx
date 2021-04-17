import React from 'react';
import PropTypes from 'prop-types';
import ImageIcon from '@material-ui/icons/Image';
import DescriptionIcon from '@material-ui/icons/Description';
import dayjs from 'dayjs';

// own
import useStyles from './styles';

function MimeIcon({ type }) {
  const classes = useStyles();
  if (type === 'image/jpeg') {
    return <ImageIcon className={classes.itemDecoration} />;
  }
  return <DescriptionIcon className={classes.itemDecoration} />;
}

MimeIcon.propTypes = {
  type: PropTypes.string,
};

export default function Attachments({ files }) {
  const classes = useStyles();
  return (
    <div>
      <ul className={classes.list}>
      {
        files && files.map((file) => (
          <li key={file.id} className={classes.item}>
           <MimeIcon type={file.type} />
           {file.description}
           <span className={classes.createdAt}>{dayjs(file.createdAt).format('dddd DD MMM YYYY - HH:mm')}</span>
          </li>
        ))
      }
      </ul>
    </div>
  );
}

Attachments.propTypes = {
  files: PropTypes.array,
};
