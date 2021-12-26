import { useState, useEffect } from 'react';
import { fetchAll } from 'api-client/tag';

export default function useTags({ callback, user, from, to }) {
  const [checked, setChecked] = useState([]);
  const [tags, setTags] = useState();

  useEffect(() => {
    (async () => {
      if (user?.token) setTags(await fetchAll(user?.token));
    })()
  }, [user])

  const handleToggle = (tagId, tagName) => () => {
    const currentIndex = checked.indexOf(tagName);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(tagName);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);

    // TODO: make request to get data
    callback({ token: user?.token, from, to, tag: tags?.find(t => t.id === tagId ) });
  };

  return {
    tags,
    handleToggle,
    checked
  }
}