import { useEffect } from 'react';
import Config from 'utils/config';
import { validateToken } from 'api-client/user';

export default function useValidateUser() {
  useEffect(() => {
    const { user } = JSON.parse(localStorage.getItem(Config.LOCALSTORAGE_KEY)) || {};
    const { token } = user?.current || {};
    function logout() {
      localStorage.clear();
      window.location.reload();
    }
    (async () => {
      try {
        if (token) await validateToken(token);
      } catch(error) {
        logout();
      }
    })();

  }, []);
}