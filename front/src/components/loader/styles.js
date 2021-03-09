import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  loader: {
    position: 'fixed',
    left: 'calc(50% - 12px)',
    top: '40%',
    zIndex: 9999,
  },
}));
