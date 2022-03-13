import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import ImageIcon from '@material-ui/icons/Image';
import DescriptionIcon from '@material-ui/icons/Description';
import dayjs from 'dayjs';
import Lightbox from 'react-awesome-lightbox';
import 'react-awesome-lightbox/build/style.css';
import i18n from 'utils/i18n';

// own
import withIsMobile from 'hocs/with-is-mobile.jsx';
import config from 'utils/config';
import {
  removeAttachment as removeAttachmentAction,
  updatedAttachment as updateAttachmentAction,
} from 'actions/transaction';
import Modal from 'components/modal';
import useStyles from './styles';

function MimeIcon({
  id, type, setShowLightbox, clickedImage,
}) {
  const isImage = ['image/jpeg', 'image/png'].includes(type);
  function handleOnClick() {
    if (isImage) {
      setShowLightbox(true);
      // eslint-disable-next-line no-param-reassign
      clickedImage.current = id;
    }
  }

  const classes = useStyles();
  if (isImage) {
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

function EditableInput({ id, initialValue, handleOnBlur }) {
  const classes = useStyles();
  const [value, setValue] = useState(initialValue);

  return (
    <input
      className={classes.description}
      value={value}
      onBlur={() => { handleOnBlur(id, value); }}
      onChange={(e) => { setValue(e.target.value); }}
    />
  );
}

EditableInput.propTypes = {
  id: PropTypes.number,
  initialValue: PropTypes.string,
  handleOnBlur: PropTypes.func,
};

function Attachments({
  user, files, transactionId, removeAttachment, updateAttachment, isMobile, lng
}) {
  const [showLightbox, setShowLightbox] = useState(false);
  const clickedImage = useRef(null);
  const classes = useStyles();

  function handleChangeDescription(id, description) {
    updateAttachment(user.token, id, { description }, transactionId);
  }

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
      .filter((i) => (['image/jpeg', 'image/png'].includes(i.type)))
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
           <EditableInput id={file.id} initialValue={file.description} handleOnBlur={handleChangeDescription} />
           <a className={classes.link} title={i18n.t('attachments.download', { lng })} href={getFileUrl(file)}> 📎</a>
           <span className={classes.createdAt}>{
             isMobile
               ? dayjs(file.createdAt).format('DD/MM/YY HH:mm')
               : dayjs(file.createdAt).format('dddd DD MMM YYYY - HH:mm')
           }</span>
           <button
             className={classes.trash}
             title={i18n.t('attachments.delete', { lng })}
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
  updateAttachment: PropTypes.func,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  lng: state.user?.current?.lang,
});

const mapDispatchToProps = (dispatch) => ({
  removeAttachment: (token, id, transactionId) => {
    dispatch(removeAttachmentAction(token, id, transactionId));
  },
  updateAttachment: (token, data, transactionId) => {
    dispatch(updateAttachmentAction(token, data, transactionId))
      .catch((error) => {
        console.log(error.message);
      });
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withIsMobile(Attachments));
