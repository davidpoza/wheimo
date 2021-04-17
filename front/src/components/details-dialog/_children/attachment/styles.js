import { makeStyles } from '@material-ui/core/styles';

export default makeStyles(() => ({
  root: {
    fontSize: '0.9em',
    fontWeight: '300',
  },
  list: {
    paddingLeft: '1em',
  },
  item: {
    listStyleType: 'none',
  },
  itemDecoration: {
    verticalAlign: 'middle',
    cursor: 'pointer',
  },
  createdAt: {
    fontSize: '0.9em',
    color: 'grey',
    marginLeft: '1em',
    fontStyle: 'italic',
  },
  link: {
    textDecoration: 'none',
  },

}));
