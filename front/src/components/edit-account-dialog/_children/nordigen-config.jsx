import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import { LinearProgress } from '@material-ui/core';
import dayjs from 'dayjs';

// own
import { createLink, retrieveAccountList, retrieveAccountDetails } from 'api-client/nordigen';
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

function AccountSelector({
  token,
  accountId,
  nordigenToken,
  accounts,
  selectedAccount,
  setSelectedAccount,
  settings,
  setSettings,
}) {
  const classes = useStyles();
  const [details, setDetails] = useState();
  const [loading, setLoading] = useState();
  return (
    <div style={{ width: '100%'}} >
      <h3>Step 2: Select account for linking to</h3>
      <FormControl>
        <InputLabel id="bank-label">Select bank account</InputLabel>
        <Select
          className={classes.bankSelector}
          labelId="bank-label"
          id="bankId"
          value={selectedAccount}
          onChange={async (e) => {
            setSelectedAccount(e.target.value);
            setSettings({
              ...settings,
              nordigenAccountId: e.target.value,
              nordigenRequisitionEndDate: dayjs.add(90, 'day').format('YYYY-MM-DD'),
            });
            setLoading(true);
            const detReq = await retrieveAccountDetails(
              token,
              accountId,
              nordigenToken,
              e.target.value
            );
            setLoading(false);
            setDetails(detReq);
          }}>
          {
            accounts?.map((a) => {
              return (
                <MenuItem key={a} value={a}>
                  {a}
                </MenuItem>
              );
            })
          }
        </Select>
      </FormControl>
      {
        loading && <LinearProgress />
      }
      {
        selectedAccount && details?.metadata?.iban
          && <div>
            <p>
              {details?.details?.account?.product}
            </p>
            <p>
              {details?.metadata?.iban}
            </p>
            <p>
              Balance: {details?.balances?.balances?.[0]?.balanceAmount?.amount} {details?.balances?.balances?.[0]?.balanceAmount?.currency}
            </p>
          </div>
      }
    </div>
  );
}

function NordigenConfig({
  token,
  accountId,
  accessId,
  setAccessId,
  accessPassword,
  setAccessPassword,
  settings,
  setSettings,
}) {
  const classes = useStyles();
  const [bankId, setBankId] = useState();
  const [collapsed, setCollapsed] = useState(settings?.nordigenAccountId ? true : false);
  const [requisitionId, setRequisitionId] = useState();
  const [nordigenToken, setNordigenToken] = useState();
  const [accounts, setAccounts] = useState();
  const [selectedAccount, setSelectedAccount] = useState();

  return (
    <>
      <h2 className={classes.additionalConfig}>Nordigen automation</h2>
      {
        settings?.nordigenAccountId
          && <h3>{ `✅ This account is already linked until ${settings?.nordigenRequisitionEndDate}.`}</h3>
      }
      {
        collapsed && <Button
          style={{marginTop: '1em'}}
          variant="outlined"
          onClick={async () => {
            setCollapsed(false);
          }}>
          Override configuration
        </Button>
      }
      {
        !collapsed
          && (
            <>
              <h3>Step 1: accept agreement</h3>
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
              <p>*Here you must use Nordigen secrets</p>
              <Button
                style={{marginTop: '1em'}}
                variant="outlined"
                disabled={!accessId || !accessPassword || !bankId}
                onClick={async () => {
                  const reqReq = await createLink(token, accountId, bankId);
                  window.open(reqReq.link, '_newtab');
                  setRequisitionId(reqReq.requisitionId);
                  setNordigenToken(reqReq.token);
                  setSettings({
                    nordigenLink: reqReq.link,
                    nordigenRequisitionId: reqReq.requisitionId,
                  });
                }}>
                Connect account
              </Button>

              {
                requisitionId && (
                  <Button
                    style={{marginTop: '1em'}}
                    variant="outlined"
                    onClick={async () => {
                      const accountsReq = await retrieveAccountList(
                        token,
                        accountId,
                        nordigenToken,
                        requisitionId
                      );
                      setAccounts(accountsReq.accounts);
                    }}>
                    List accounts
                  </Button>
                )
              }

              {
                accounts
                  && <AccountSelector
                  token={token}
                  nordigenToken={nordigenToken}
                  accountId={accountId}
                  selectedAccount={selectedAccount}
                  setSelectedAccount={setSelectedAccount}
                  accounts={accounts}
                  settings={settings}
                  setSettings={setSettings}
                />
              }
            </>
          )
      }

    </>
  );
}

NordigenConfig.propTypes = {
  token: PropTypes.string,
  accessId: PropTypes.string,
  setAccessId: PropTypes.func,
  accessPassword: PropTypes.string,
  setAccessPassword: PropTypes.func,
  settings: PropTypes.object,
  setSettings: PropTypes.func,
};


const mapStateToProps = (state) => ({
  token: state.user?.current?.token,
});

export default connect(mapStateToProps)(NordigenConfig);
