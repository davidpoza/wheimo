import { makeStyles } from '@material-ui/core/styles';

export default makeStyles((theme) => ({
  root: {
    paddingTop: '40px',
    [theme.breakpoints.up('lg')]: {
      paddingTop: '5px',
    },
    overflowY: 'scroll',
    overflowX: 'hidden',
    flex: 1,
    '&::-webkit-scrollbar': {
      backgroundColor: '#fff',
      width: '10px',
    },
    '&::-webkit-scrollbar-track': {
      backgroundColor: '#fff',
    },
    '&::-webkit-scrollbar-thumb ': {
      backgroundColor: '#babac0',
      borderRadius: '16px',
      border: '16px'
    },
    '&::-webkit-scrollbar-button ': {
      display: 'none',
    },
  },
}));
// body::-webkit-scrollbar {
//   background-color: #fff;
//   width: 16px;
// }

// /* background of the scrollbar except button or resizer */
// body::-webkit-scrollbar-track {
//   background-color: #fff;
// }

// /* scrollbar itself */
// body::-webkit-scrollbar-thumb {
//   background-color: #babac0;
//   border-radius: 16px;
//   border: 4px solid #fff;
// }

// /* set button(top and bottom of the scrollbar) */
// body::-webkit-scrollbar-button {
//   display:none;
// }