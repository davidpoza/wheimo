import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    display: 'flex',
    alignItems: 'end',
    justifyContent: 'center',
    '& > *': {
      margin: '10px',
    },
  },
  dateSelector: {
    width: '7em',
    '& .MuiIconButton-root': {
      padding: '0',
    },
  },
  search: {

  },
  tags: {
    marginBottom: '8px',
  },
  chartsSwitch: {
    alignSelf: 'normal',
    '& > label': {
      margin: 0,
    },
  },
}));
