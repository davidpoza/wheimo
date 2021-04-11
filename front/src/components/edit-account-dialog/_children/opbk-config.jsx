import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';

// own
import useStyles from '../styles';

export default function OpbkConfig({
  accessId, setAccessId,
  accessPassword, setAccessPassword,
  settings, setSettings,
}) {
  const classes = useStyles();

  function composeSettingsObject({ c, p }) {
    return ({
      contract: c || settings.contract,
      product: p || settings.product,
    });
  }

  return (
    <>
      <h2 className={classes.additionalConfig}>Open Bank automation</h2>
      <p>*Fill to reset</p>
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
      <TextField
        required
        className={classes.contractNumber}
        margin="dense"
        id="contractNumber"
        label="Contract Number"
        type="password"
        value={settings.contract}
        onChange={(e) => {
          setSettings(composeSettingsObject({ c: e.target.value }));
        }}
        fullWidth
      />
      <TextField
        required
        className={classes.product}
        margin="dense"
        id="product"
        label="Product Id"
        type="password"
        value={settings.product}
        onChange={(e) => {
          setSettings(composeSettingsObject({ p: e.target.value }));
        }}
        fullWidth
      />
    </>
  );
}

OpbkConfig.propTypes = {
  accessId: PropTypes.string,
  setAccessId: PropTypes.func,
  accessPassword: PropTypes.string,
  setAccessPassword: PropTypes.func,
  settings: PropTypes.object,
  setSettings: PropTypes.func,
};
