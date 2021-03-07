import React, { useEffect, useState } from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import Checkbox from '@material-ui/core/Checkbox';
import DayJsUtils from '@date-io/dayjs';
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from '@material-ui/pickers';

// own
import useStyles from './styles';
import AccountSelect from '../account-select';
import TagsSelect from '../tags-select';

function CreateTransationDialog() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [incoming, setIncoming] = useState(false);
  const [receipt, setReceipt] = useState(false);
  const [amount, setAmount] = useState(0.0);
  const [description, setDescription] = useState('');
  const [comments, setComments] = useState('');
  const [emitterName, setEmitterName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState(0);
  const [tags, setTags] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  function fixAmountSign(val) {
    if (incoming) {
      setAmount(Math.abs(val));
    } else {
      setAmount(Math.abs(val) * -1);
    }
  }

  useEffect(() => {
    fixAmountSign(amount);
  }, [incoming]);

  function handleDateChange(date) {
    setSelectedDate(date);
  }

  function handleClickOpen() {
    setOpen(true);
  }

  function handleClose() {
    setOpen(false);
  }

  function handleIncomingSwitch() {
    setIncoming(!incoming);
  }

  function handleAmountChange(e) {
    const str = e.target.value;
    if (str) {
      fixAmountSign(parseFloat(str, 10));
    }
  }

  return (
    <div>
      <Fab color="primary" aria-label="add" onClick={handleClickOpen}>
        <AddIcon />
      </Fab>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Add manual transaction</DialogTitle>
        <DialogContent>
          <FormGroup row>
            <FormControlLabel
              control={<Checkbox checked={receipt} onChange={() => { setReceipt(!receipt); }} name="receipt" />}
              label={receipt ? 'It\'s a receipt' : 'It\'s not a receipt'}
            />
          </FormGroup>
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
            <AccountSelect
              label="Account"
              value={selectedAccount}
              handleChange={(e) => { setSelectedAccount(e.target.value); }}
            />
          </div>

          <FormGroup row className={classes.transactionTargetSwitch}>
            <FormControlLabel
              control={<Switch checked={incoming} onChange={handleIncomingSwitch} name="incoming" />}
              label={incoming ? 'It\'s an incoming transaction' : 'It\'s an outgoing transaction'}
            />
          </FormGroup>

          <TextField
            className={classes.transactionTargetTextField}
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

          <TextField
            required
            margin="dense"
            id="amount"
            label="Amount"
            type="number"
            value={amount}
            onChange={handleAmountChange}
            fullWidth
          />

          <TextField
            margin="dense"
            id="description"
            label="Description"
            type="text"
            value={description}
            onChange={(e) => { setDescription(e.target.value); }}
            fullWidth
          />

          <TextField
            className={classes.comments}
            multiline
            margin="dense"
            id="comments"
            label="Comments"
            type="text"
            value={comments}
            onChange={(e) => { setComments(e.target.value); }}
            fullWidth
          />

          <TagsSelect label="Tags" values={tags} handleOnChange={ (e, value) => {
            setTags(value.map((tag) => (tag.id)));
          } } />
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

export default CreateTransationDialog;
