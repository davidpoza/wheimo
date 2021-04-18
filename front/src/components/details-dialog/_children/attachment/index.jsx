import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImageIcon from '@material-ui/icons/Image';
import DescriptionIcon from '@material-ui/icons/Description';
import dayjs from 'dayjs';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';

// own
import useStyles from './styles';
import config from '../../../../utils/config';
import Modal from '../../../modal';
import { removeAttachment as removeAttachmentAction } from '../../../../actions/transaction';

function MimeIcon({
  id, type, setShowLightbox, clickedImage,
}) {
  function handleOnClick() {
    if (type === 'image/jpeg') {
      setShowLightbox(true);
      // eslint-disable-next-line no-param-reassign
      clickedImage.current = id;
    }
  }

  const classes = useStyles();
  if (type === 'image/jpeg') {
    return <ImageIcon className={classes.itemDecoration} onClick={handleOnClick} />;
  }
  return <DescriptionIcon className={classes.itemDecoration} onClick={handleOnClick} />;
}

MimeIcon.propTypes = {
  id: PropTypes.number,
  type: PropTypes.string,
  setShowLightbox: PropTypes.func,
  clickedImage: PropTypes.func,
};

function Attachments({
  user, files, transactionId, removeAttachment,
}) {
  const [showLightbox, setShowLightbox] = useState(false);
  const clickedImage = useRef(null);
  const classes = useStyles();

  function handleRemoveAttachment(id) {
    removeAttachment(user.token, id, transactionId);
  }

  function handleOnClose() {
    setShowLightbox(false);
    clickedImage.current = null;
  }

  function getFileUrl(f) {
    return `${config.API_HOST}/attachments/${f.id}?download=1&auth=${user.token}`;
  }

  function prepareLightboxArray(fa) {
    return fa
      .filter((i) => (i.type === 'image/jpeg'))
      .map((i) => ({ id: i.id, url: getFileUrl(i) }));
  }
  const lightboxImages = prepareLightboxArray(files);

  return (
    <div>
      <ul className={classes.list}>
      {
        files && files.map((file) => (
          <li key={file.id} className={classes.item}>
           <MimeIcon id={file.id} type={file.type} setShowLightbox={setShowLightbox} clickedImage={clickedImage} />
           {file.description}
           <a className={classes.link} title="download attachment" href={getFileUrl(file)}> 📎</a>
           <span className={classes.createdAt}>{dayjs(file.createdAt).format('dddd DD MMM YYYY - HH:mm')}</span>
           <button
             className={classes.trash}
             title="delete attachment"
             onClick={() => handleRemoveAttachment(file.id)}>
               🗑
           </button>
          </li>
        ))
      }
      {clickedImage.current}
      {
        showLightbox && lightboxImages.length > 0
          && <Modal>
            <Lightbox
              images={lightboxImages}
              onClose={handleOnClose}
              startIndex={lightboxImages.map((e) => e.id).indexOf(clickedImage.current)}
            />
          </Modal>
      }
      </ul>
    </div>
  );
}

Attachments.propTypes = {
  files: PropTypes.array,
  user: PropTypes.object,
  transactionId: PropTypes.number,
  removeAttachment: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
});

const mapDispatchToProps = (dispatch) => ({
  removeAttachment: (token, id, transactionId) => {
    dispatch(removeAttachmentAction(token, id, transactionId));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Attachments);
