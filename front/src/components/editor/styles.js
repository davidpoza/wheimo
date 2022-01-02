import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    height: '15em',
    display: 'flex',
    // backgroundColor: theme.palette.type === 'dark' ? '#121212' : '#f0f8ff',
  },
  preview: {
    width: '100%',

    padding: '1em',
    flex: 1,
  },
  empty: {
    width: '100%',
    // backgroundColor: theme.palette.type === 'dark' ? '#121212' : '#f0f8ff',
    padding: '1em',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  editor: {
    // backgroundColor: theme.palette.type === 'dark' ? '#121212' : '#f0f8ff',
  }
}));
