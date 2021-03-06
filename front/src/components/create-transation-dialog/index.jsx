import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import DayJsUtils from '@date-io/dayjs';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

// own
import useStyles from './styles.js';
import { fetchAll as fetchAllAccounts } from '../../api-client/account';

function AccountSelect({ entries, label, value, handleChange }) {
  const classes = useStyles();
  return (
    <FormControl>
      <InputLabel id="account-label">{label}</InputLabel>
      <Select
        className={classes.accountSelector}
        labelId="account-label"
        id="account"
        value={value}
        renderValue={(value) => entries.filter((entry) => entry.id === value)[0].name}
        onChange={handleChange}
      >
        {
          entries.map((entry) => {
            return (
              <MenuItem value={entry.id}>{entry.name}</MenuItem>
            );
          })
        }
      </Select>
    </FormControl>
  );

}

function CreateTransationDialog({
  user,
}) {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [incoming, setIncoming] = useState(false);
  const [amount, setAmount] = useState(0.0);
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const [emitterName, setEmitterName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchAllAccounts(user.token);
        setAccounts(data);
      } catch(error) {
        console.log(error.message);
      }
    }
    fetchData();
  }, [user]);

  function handleDateChange(date) {
    setSelectedDate(date);
  };

  function handleClickOpen() {
    setOpen(true);
  };

  function handleClose() {
    setOpen(false);
  };

  function handleIncomingSwitch() {
    setIncoming(!incoming);
  }

  return (
    <div>
      <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add manual transaction</DialogTitle>
        <DialogContent>
          <div className={classes.selectGroup}>
            <MuiPickersUtilsProvider utils={DayJsUtils} className={classes.dateSelector}>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Transaction date"
                format="DD/MM/YYYY"
                value={selectedDate}
                onChange={handleDateChange}
                KeyboardButtonProps={{
                  'aria-label': 'change date',
                }}
              />
            </MuiPickersUtilsProvider>
            <AccountSelect entries={accounts} label="Account" value={selectedAccount} handleChange={(e) => { console.log(e.target);setSelectedAccount(e.target.value) }} />
          </div>



          <FormGroup row>
            <FormControlLabel
              control={<Switch checked={incoming} onChange={handleIncomingSwitch} name="incoming" />}
              label={incoming ? 'Incoming' : 'Outgoing'}
            />
            <TextField
              margin="dense"
              id={incoming ? 'emitterName' : 'receiverName'}
              label={incoming ? 'Emitter' : 'Receiver'}
              type="text"
              value={incoming ? emitterName : receiverName}
              onChange={(e) => {
                if (incoming) {
                  setEmitterName(e.target.value);
                } else {
                  setReceiverName(e.target.value);
                }
              }}
              fullWidth
            />
          </FormGroup>

          <TextField
            required
            margin="dense"
            id="amount"
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => { setAmount(e.target.value) }}
            fullWidth
          />

          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            value={description}
            onChange={(e) => { setDescription(e.target.value) }}
            fullWidth
          />

          <TextField
            multiline
            margin="dense"
            id="comments"
            label="Comments"
            type="text"
            value={comments}
            onChange={(e) => { setComments(e.target.value) }}
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleClose} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

const mapStateToProps = (state) => {
  return {
    user: state.user.current
  }
}


export default connect(mapStateToProps)(CreateTransationDialog);