import React, { useEffect } from 'react';

export default function usePortal(id) {
  const rootElemRef = React.useRef(document.createElement('div'));

  /* eslint-disable */
  useEffect(function setupElement() {
    // Look for existing target dom element to append to
    const parentElem = document.querySelector(`#${id}`);
    // Add the detached element to the parent
    parentElem.appendChild(rootElemRef.current);
    // This function is run on unmount
    return function removeElement() {
      rootElemRef.current.remove();
    };
  }, [id]);

  return rootElemRef.current;
}