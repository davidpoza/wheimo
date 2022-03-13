import React from 'react';

// material ui
// import useMediaQuery from '@material-ui/core/useMediaQuery';
import {isMobileDevice} from 'utils/utilities';

const withIsMobile = (Component) => (props) => {
  const isMobile = isMobileDevice();
  return (<Component {...props} isMobile={isMobile} />);
}

export default withIsMobile;