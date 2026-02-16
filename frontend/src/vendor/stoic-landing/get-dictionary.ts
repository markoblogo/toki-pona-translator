import 'server-only'

import 'server-only'

const dictionaries = {
  en: () => import('./dictionaries/en.json').then((module) => module.default),
  tp: () => import('./dictionaries/tp.json').then((module) => module.default),
}

export const getDictionary = async (locale: 'en' | 'tp') => {
  if (dictionaries[locale]) {
    return dictionaries[locale]();
  }
  return dictionaries['en']();
}
