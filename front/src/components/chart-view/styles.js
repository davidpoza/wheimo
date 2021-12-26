import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    // width: '200px',

    // marginLeft: 'auto',
    // marginRight: 'auto',
    // padding: '0',
    [theme.breakpoints.up('md')]: {
      width: '800px',
      padding: '5% 10%',
      marginLeft: 'auto',
      marginRight: 'auto',
    }
  },
  buttons: {

  },
  info: {

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
    }
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
  }
}));
