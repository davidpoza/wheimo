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
    display: 'flex',
    alignItems: 'center',
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
  trash: {
    marginLeft: 'auto',
    border: 'none',
    background: 'none',
    cursor: 'pointer',
  },
  description: {
    padding: '1px',
    border: 'none',
    borderRadius: '0px !important',
    '&:hover, &:focus': {
      padding: '0px',
      border: '1px solid #ccc',
      outline: 'none !important',
    },
  },

}));
