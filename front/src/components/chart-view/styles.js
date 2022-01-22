import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    display: 'flex',
    flex: '1 1 1px',
    flexDirection: 'column',
    width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    [theme.breakpoints.up('md')]: {
      marginLeft: '20%',
      marginRight: '20%',
      width: 'auto',
      padding: '5% 0',
    }
  },
  map: {
    height: '400px',
    width: '95%',
    marginLeft: 'auto',
    marginRight: 'auto',

    [theme.breakpoints.up('md')]: {
      width: '100%',
      maxWidth: '100%',
      paddingLeft: 0,
    },

      fill: '#fff !important'


  },
  item: {
    '&>span': {
      fontWeight: 'bold'
    }
  },
  list: {
    '&>ul': {
      listStyleType: 'none',
      margin: 0,
      padding: 0,
      marginTop: '1em',
      marginRight: '2em',
    },
    fontSize: '0.8em',
    minWidth: '50%',
    [theme.breakpoints.up('md')]: {
      minWidth: '100%',
    }
  },
  tagList: {
    overflowY: 'auto',
    flex: '1 1 1px',
    marginTop: '2em',
    // marginBottom: '1em',
    boxShadow: theme.palette.type === 'dark'
      ? 'inset 0px -20px 13px -3px #181818'
      : 'inset 0px -20px 13px -3px #ccc',
    [theme.breakpoints.up('md')]: {
      boxShadow: 'none'
    }
  },
}));
