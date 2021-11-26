import { makeStyles } from '@material-ui/core/styles';
import config from '../../utils/config';

export default makeStyles((theme) => ({
  appBar: {
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
