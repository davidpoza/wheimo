import get from 'lodash.get';
import es from './es';
import en from './en';

export default function translate(path, lang = 'en') {
  if (lang === 'es') return get(es, path);
  return get(en, path);
};
