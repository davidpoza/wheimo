import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    height: '15em',
    display: 'flex',
  },
  preview: {
    width: '100%',
    backgroundColor: '#f0f8ff',
    padding: '1em',
    flex: 1,
  },
  empty: {
    width: '100%',
    backgroundColor: '#f0f8ff',
    padding: '1em',
    textAlign: 'center',
    fontStyle: 'italic',
  },
}));
