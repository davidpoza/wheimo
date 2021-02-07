import { createMuiTheme } from "@material-ui/core/styles";

export default createMuiTheme({
  palette: {
    primary: {
      main: '#1db954',
    },
    secondary: {
      light: '#212121',
      main: '#121212',
      contrastText: '#ffcc00',
    },
    background: {
      default: '#121212',
      paper: '#191414',
    },
    text: {
      primary: '#fff',
      secondary: '#b3b3b3',
    },
    action: {
      active: '#1db954',
      selected: '#282828',
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
});