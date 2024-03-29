import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import dayjs from 'dayjs';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import i18n from 'utils/i18n';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

// own
import {
  settingsDialogOpen as openAction,
  settingsDialogClose as closeAction,
  updateUser as updateAction,
} from 'actions/user';
import { getListOfLogins } from 'api-client/user';
import useStyles from './styles';
import { mergeDialogClose } from 'actions/transaction';

function PaperComponent(props) {
  return (
    <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
      <Paper {...props} />
    </Draggable>
  );
}

function SettingsDialog({
  isOpen,
  close,
  user,
  tags,
  updateUser,
  lng,
}) {
  const classes = useStyles();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [theme, setTheme] = useState();
  const [ignoredTagId, setIgnoredTagId] = useState();
  const [lang, setLang] = useState();
  const [logins, setLogins] = useState();

  function handleClose() {
    close();
  }

  useEffect(() => {
    (async () => {
      setLogins(await getListOfLogins(user.token));
    })();
    setName(user.name);
    setEmail(user.email);
    setTheme(user?.theme);
    setLang(user.lang);
    setIgnoredTagId(user?.ignoredTagId);

  }, [user]);

  async function processData() {
    updateUser(user.token, user.id, { name, lang, theme, ignoredTagId });
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
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
        {i18n.t('userSettings.title', { lng })}
      </DialogTitle>
      <DialogContent>

        <TextField
          className={classes.transactionTargetTextField}
          margin="dense"
          label={i18n.t('userSettings.name', { lng })}
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          fullWidth
        />

        <TextField
          className={classes.transactionTargetTextField}
          disabled
          margin="dense"
          label={i18n.t('userSettings.email', { lng })}
          type="text"
          value={email}
          onChange={(e) => {
            setName(e.target.value);
          }}
          fullWidth
        />

        <FormControl className={classes.select}>
          <InputLabel id="language-select-label">{i18n.t('userSettings.language', { lng })}</InputLabel>
          <Select
            className={classes.select}
            labelId="language-select-label"
            id="language"
            value={lang}
            onChange={(e) => {
              setLang(e.target.value);
            }}
          >
            {
              ['en', 'es'].map((entry, index) => (
                <MenuItem key={index} value={entry}>{entry}</MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <FormControl className={classes.select}>
          <InputLabel id="language-select-label">{i18n.t('userSettings.theme', { lng })}</InputLabel>
          <Select
            labelId="theme-select-label"
            id="theme"
            value={theme}
            onChange={(e) => {
              setTheme(e.target.value);
            }}
          >
            {
              ['dark', 'light'].map((entry, index) => (
                <MenuItem key={index} value={entry}>{entry}</MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <FormControl className={classes.select}>
          <InputLabel id="ignored-tag-select-label">{i18n.t('userSettings.ignoredTag', { lng })}</InputLabel>
          <Select
            labelId="ignored-tag-select-label"
            id="ignoredTagId"
            value={ignoredTagId}
            onChange={(e) => {
              setIgnoredTagId(e.target.value);
            }}
          >
            {
              tags?.map((tag) => (
                <MenuItem key={tag.id} value={tag.id}>{tag.name}</MenuItem>
              ))
            }
          </Select>
        </FormControl>

        <h3 style={{ marginTop: '2em' }}>
          {i18n.t('userSettings.lastAccess', { lng })}
        </h3>
        <Paper style={{ width: '100%', overflow: 'hidden' }}>
          <TableContainer style={{ maxHeight: 200 }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="left" className={classes.tableHead}>{i18n.t('userSettings.accessDate', { lng })}</TableCell>
                  <TableCell align="left" className={classes.tableHead}>{i18n.t('userSettings.ip', { lng })}</TableCell>
                  <TableCell align="left" className={classes.tableHead}>{i18n.t('userSettings.location', { lng })}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {
                  logins?.map((log, index) => <TableRow
                    key={index}>
                      <TableCell align="left">{dayjs(log.createdAt).format('DD/MM/YYYY HH:mm')}</TableCell>
                      <TableCell align="left">{log.ip}</TableCell>
                      <TableCell align="left">{log.location}</TableCell>
                    </TableRow>)
                }
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          {i18n.t('userSettings.cancel', { lng })}
        </Button>
        <Button color="primary" onClick={processData}>
          {i18n.t('userSettings.save', { lng })}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SettingsDialog.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  user: PropTypes.object,
  tags: PropTypes.array,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  tags: state.tag.fetchedTags,
  isOpen: state.user.settingsDialogOpen,
  lng: state.user?.current?.lang,
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (token, userId, { name, theme, lang, email, ignoredTagId }) => {
    dispatch(updateAction(token, userId, { name, theme, lang, email, ignoredTagId }))
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
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsDialog);
