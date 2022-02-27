import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  appBar: {
    backgroundColor: theme.palette.type === 'dark' ? '#303f9f' : '#3f51b5'
  },
  block: {
    display: 'flex',
    flexDirection: 'row',
    flexGrow: 1,
    '& > svg': {
      cursor: 'pointer',
    }
  },
  title: {
    textAlign: 'left',
    display: 'flex',
    flexDirection: 'column',
    lineHeight: '1',
  },
  appName: {
    fontSize: '0.5em',
    fontWeight: 'bold',
  },
  appNameColored: {
    color: '#f96096',
  },
}));
