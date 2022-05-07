import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

// own
import { auth } from 'api-client/nordigen';
import useStyles from '../styles';

function BankSelector({ bankId, setBankId }) {
  const classes = useStyles();
  return (
    <div>
      <FormControl>
        <InputLabel id="bank-label">Select bank entity</InputLabel>
        <Select
          className={classes.bankSelector}
          labelId="bank-label"
          id="bankId"
          value={bankId}
          onChange={(e) => setBankId(e.target.value)}
        >
          <MenuItem key='none' value={undefined}>None</MenuItem>
          <MenuItem key='BANCSABADELL_BSABESBB' value="BANCSABADELL_BSABESBB">Sabadell</MenuItem>
          <MenuItem key='BANKINTER_BKBKESMM' value="BANKINTER_BKBKESMM">Bankinter</MenuItem>
          <MenuItem key='BBVA_BBVAESMM' value="BBVA_BBVAESMM">BBVA</MenuItem>
          <MenuItem key='CAIXABANK_CAIXESBB' value="CAIXABANK_CAIXESBB">Caixa bank</MenuItem>
          <MenuItem key='CORPORATESANTANDER_BSCHXXMM' value="CORPORATESANTANDER_BSCHXXMM">Santander</MenuItem>
          <MenuItem key='EVOBANCO_EVOBESMM' value="EVOBANCO_EVOBESMM">Evobanco</MenuItem>
          <MenuItem key='OPENBANK_OPENESMM' value="OPENBANK_OPENESMM">Openbank</MenuItem>
        </Select>
      </FormControl>
    </div>
  );
}

function AccountSelector() {
  return (
    <div>

    </div>
  );
}

export default function NordigenConfig({
  accessId, setAccessId,
  accessPassword, setAccessPassword,
  settings, setSettings,
}) {
  const classes = useStyles();
  const [token, setToken] = useState();
  const [showWizard, setShowWizard] = useState(false);
  const [bankId, setBankId] = useState();

  return (
    <>
      <h2 className={classes.additionalConfig}>Nordigen automation</h2>
      <p>*Nordigen secrets</p>
      <TextField
        required
        className={classes.accessId}
        margin="dense"
        id="accessId"
        label="Access Id"
        type="password"
        value={accessId}
        onChange={(e) => {
          setAccessId(e.target.value);
        }}
      />
      <TextField
        required
        className={classes.accessPassword}
        margin="dense"
        id="accessPassword"
        label="Access password"
        type="password"
        value={accessPassword}
        onChange={(e) => {
          setAccessPassword(e.target.value);
        }}
      />
      <BankSelector bankId={bankId} setBankId={setBankId} />
      <Button
        style={{ marginTop: '1em' }}
        variant="outlined"
        disabled={!accessId || !accessPassword || !bankId}
        onClick={async () => {
          const t = auth(accessId, accessPassword);
          console.log(t)
          setToken(t);
          setShowWizard(true);
        }}
      >
        Connect account
      </Button>
      {
        showWizard
          && <AccountSelector />
      }
    </>
  );
}

NordigenConfig.propTypes = {
  accessId: PropTypes.string,
  setAccessId: PropTypes.func,
  accessPassword: PropTypes.string,
  setAccessPassword: PropTypes.func,
  settings: PropTypes.object,
  setSettings: PropTypes.func,
};
