import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import dayjs from 'dayjs';
import IconButton from '@material-ui/core/IconButton';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import CircularProgress from '@material-ui/core/CircularProgress';
import CreateIcon from '@material-ui/icons/Create';
import i18n from 'utils/i18n';

// own
import withIsMobile from 'hocs/with-is-mobile.jsx';
import ConditionalWrapper from 'shared/conditional-wrapper';
import {
  addAttachment as addAttachmentAction,
  create as createAction,
  detailsDialogClose as closeAction,
  detailsDialogOpen as openAction,
  update as updateAction,
  createEditDialogOpen as openTransactionDialogAction,
} from 'actions/transaction';
import {
  contextMenuChangeIndex as changeIndexAction,
  contextMenuChangeId as changeIdAction,
} from 'actions/ui';
import useStyles from './styles';
import Editor from '../editor';
import Tags from '../tags';
import Attachments from './_children/attachment';

function PaperComponent(props) {
  return (
    <ConditionalWrapper
      condition={!props.isMobile}
      ElementType={Draggable}
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </ConditionalWrapper>
  );
}

function DetailsDialog({
  addAttachment,
  changeUIId,
  changeUIIndex,
  close,
  id,
  index,
  isOpen,
  isUploadingAttachment,
  transactions,
  updateTransaction,
  openTransactionDialog,
  user,
  lng,
  isMobile,
}) {
  const classes = useStyles();
  const [comments, setComments] = useState('');

  const {
    description, amount, date, tags, attachments,
  } = transactions?.[index] || {};
  const account = transactions?.[index]?.account?.name;

  const uploadFile = useCallback((blob, desc, transactionId) => {
    const attachmentsData = new FormData();
    attachmentsData.append('attachment', blob);
    attachmentsData.append('description', desc);
    attachmentsData.append('transactionId', transactionId);
    addAttachment(user.token, attachmentsData);
  }, [addAttachment, user.token]);

  const setInitialState = useCallback(() => {
    if (transactions?.[index]) {
      setComments(transactions?.[index]?.comments);
    }
  }, [setComments, transactions, index]);

  function clearForm() {
    setComments('');
  }

  useEffect(() => {
    if (index !== undefined) {
      setInitialState();
    }
  }, [setInitialState, index]);

  useEffect(() => {
    if (index !== undefined) {
      document.onpaste = (pasteEvent) => {
        const item = pasteEvent.clipboardData.items[0];
        if (item.type.indexOf('image') === 0) {
          uploadFile(item.getAsFile(), 'attachment', transactions?.[index].id);
        }
        return () => {
          document.onpaste = null;
        };
      };
    }
  }, [uploadFile, index, transactions]);

  function handleOnAddFile(e) {
    uploadFile(e.target.files[0], 'attachment', transactions?.[index].id);
  }

  function handleClose() {
    clearForm();
    changeUIId(undefined);
    changeUIIndex(undefined);
    close();
    const getUrl = window.location;
    const homeUrl = `${getUrl.protocol}//${getUrl.host}/`;
    if (window.location.href !== homeUrl) {
      // eslint-disable-next-line
      history.replaceState('', '', homeUrl);
    }
  }

  function handleEdit() {
    close();
    openTransactionDialog();
  }

  function handleOnKeyDown(e) {
    if(e.keyCode===27) { //esc
      e.preventDefault();
      handleClose();
    } else if(e.keyCode===13 && e.ctrlKey) {
      e.preventDefault();
      processData();
    }
  }

  async function processData() {
    const data = {
      comments: comments || undefined,
    };

    updateTransaction(user.token, id, index, data);
    changeUIIndex(undefined);
    clearForm();
    close();
  }

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={isOpen}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
      PaperComponent={PaperComponent}
      onKeyDown={handleOnKeyDown}
      PaperProps={{ isMobile }}
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {i18n.t('transactionDetails.title', { lng })} {`#${id}`}
          <Button onClick={handleEdit} color="primary">
            <CreateIcon />
          </Button>
        </div>
      </DialogTitle>
      <DialogContent className={classes.root}>
        <Tags tags={tags} />
        <p className={classes.item}>
          <h2 className={classes.h2}>{account} </h2>
          <span>{amount}€</span>
        </p>
        <p className={classes.item}>
          <h2 className={classes.h2}>{i18n.t('transactionDetails.date', { lng })}</h2>
          <span>{dayjs(date).format('dddd DD MMM YYYY')}</span>
        </p>
        <p className={classes.item}>
          <h2 className={classes.h2}>{i18n.t('transactionDetails.description', { lng })}</h2>
          <span>{description}</span>
        </p>
        <p className={classes.item}>
          <h2 className={classes.h2}>{i18n.t('transactionDetails.notes', { lng })}</h2>
        </p>
        <Editor content={comments} setContent={ (_content) => { setComments(_content); }} />
        {
          ((attachments && attachments.length > 0) || (isUploadingAttachment))
            && <>
              <p className={classes.item}>
                <h2 className={classes.h2}>{i18n.t('transactionDetails.attachments', { lng })}</h2>
              </p>
              {
                isUploadingAttachment
                 && <CircularProgress className={classes.uploading} size={16}/>
              }
              <Attachments files={attachments} transactionId={transactions?.[index].id} />
            </>
        }
      </DialogContent>

      <DialogActions>
        <span className={classes.attachmentButton}>
          <input
            accept=".jpg,.pdf"
            className={classes.attachmentInput}
            id="icon-button-file"
            type="file"
            onChange={handleOnAddFile}
          />
          <label htmlFor="icon-button-file">
            <IconButton color="primary" aria-label="Attach" component="span" className={classes.attachmentButton}>
              <AttachFileIcon /> {i18n.t('transactionDetails.attachFile', { lng })}
            </IconButton>
          </label>
        </span>
        <Button onClick={handleClose} color="primary">
          {i18n.t('transactionDetails.cancel', { lng })}
        </Button>
        <Button onClick={processData} color="primary">
          {
            index !== undefined
              ? i18n.t('transactionDetails.save', { lng })
              : i18n.t('transactionDetails.add', { lng })
          }
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DetailsDialog.propTypes = {
  addAttachment: PropTypes.func,
  changeUIId: PropTypes.func,
  changeUIIndex: PropTypes.func,
  close: PropTypes.func,
  createTransaction: PropTypes.func,
  id: PropTypes.number,
  index: PropTypes.number,
  isOpen: PropTypes.bool,
  isUploadingAttachment: PropTypes.bool,
  open: PropTypes.func,
  transactions: PropTypes.array,
  updateTransaction: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  contextMenuState: state.ui.contextMenuState,
  id: state.ui.contextMenuState.id,
  index: state.ui.contextMenuState.index,
  isOpen: state.transaction.detailsDialogOpen,
  isUploadingAttachment: state.transaction.isUploadingAttachment,
  transactions: state.transaction.fetchedTransactions,
  user: state.user.current,
  lng: state.user?.current?.lang,
});

const mapDispatchToProps = (dispatch) => ({
  createTransaction: (token, data) => {
    dispatch(createAction(token, data))
      .catch((error) => {
        console.log(error.message);
      });
  },
  updateTransaction: (token, id, index, data) => {
    dispatch(updateAction(token, id, index, data))
      .catch((error) => {
        console.log(error.message);
      });
  },
  open: () => {
    dispatch(openAction());
  },
  close: () => {
    dispatch(closeAction());
  },
  changeUIId: (id) => {
    dispatch(changeIdAction(id));
  },
  changeUIIndex: (index) => {
    dispatch(changeIndexAction(index));
  },
  addAttachment: (token, formData) => {
    dispatch(addAttachmentAction(token, formData));
  },
  openTransactionDialog: () => {
    dispatch(openTransactionDialogAction());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(withIsMobile(DetailsDialog));
