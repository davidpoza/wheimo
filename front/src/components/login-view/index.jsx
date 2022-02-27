import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import get from 'lodash.get';

// material ui
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

// own
import useStyles from './styles';
import { getAuth as getAuthAction } from '../../actions/user';

function Login({ getAuth, user, history }) {
  const classes = useStyles();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    if (get(user, 'token')) {
      history.push('/');
    }
  }, [history, user]);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setSnackbarOpen(false);
  };

  async function onFormSubmit(e) {
    e.preventDefault();
    getAuth(email, password)
      .catch(err => {
        setSnackbarOpen(true);
      })
  }

  return (
    <>
      <Grid container direction="column" justify="center" alignItems="center" style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
      }}>
        <Grid item xs={12} lg={5} className={classes.root}>
          <form noValidate onSubmit={onFormSubmit}>
            <Typography variant="h1" className={classes.title}>Where Is My Money</Typography>
            <div>
              <TextField
                id="email" label="Email" variant="outlined" className={classes.email} autoFocus={true}
                value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <TextField id="password" type="password" label="Password" variant="outlined" className={classes.password}
                value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <Button variant="contained" color="primary" className={classes.button} type="submit" disableElevation disabled={!email || !password }>
              Login
            </Button>
          </form>
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={2000}
        onClose={handleClose}
        message="Wrong email or password"
    />
    </>
  );
}

Login.propTypes = {
  getAuth: PropTypes.func,
  user: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = (state) => ({
  loading: state.user.isLoading,
  user: state.user.current,
  error: state.user.error,
  errorMessage: state.user.errorMessage,
});

const mapDispatchToProps = (dispatch) => ({
  getAuth: (email, password) => {
    return dispatch(getAuthAction(email, password))
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
