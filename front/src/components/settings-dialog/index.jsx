import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
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

// own
import useStyles from './styles';
import {
  settingsDialogOpen as openAction,
  settingsDialogClose as closeAction,
  updateUser as updateAction,
} from '../../actions/user';

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
  updateUser
}) {
  const classes = useStyles();
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [theme, setTheme] = useState();
  const [lang, setLang] = useState();
  const [photo, setPhoto] = useState();

  function handleClose() {
    close();
  }

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
    setTheme(user.theme);
    setLang(user.lang);
  }, [user]);

  async function processData() {
    updateUser(user.token, user.id, { name, lang, theme });
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
        User settings
      </DialogTitle>
      <DialogContent>

        <TextField
          className={classes.transactionTargetTextField}
          margin="dense"
          label="Name"
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
          label="Email"
          type="text"
          value={email}
          onChange={(e) => {
            setName(e.target.value);
          }}
          fullWidth
        />

        <FormControl className={classes.select}>
          <InputLabel id="language-select-label">Language</InputLabel>
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
          <InputLabel id="language-select-label">Theme</InputLabel>
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

      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button color="primary" onClick={processData}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

SettingsDialog.propTypes = {
  isOpen: PropTypes.bool,
  close: PropTypes.func,
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  user: state.user.current,
  isOpen: state.user.settingsDialogOpen,
});

const mapDispatchToProps = (dispatch) => ({
  updateUser: (token, userId, { name, theme, lang, email }) => {
    dispatch(updateAction(token, userId, { name, theme, lang, email }))
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
