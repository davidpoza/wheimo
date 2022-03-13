import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';

// own
import usePortal from 'hooks/use-portal';

export default function Modal({ children }) {
  const target = usePortal('root');
  return ReactDOM.createPortal(children, target);
}

Modal.propTypes = {
  children: PropTypes.node,
}