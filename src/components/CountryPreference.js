const STORAGE_KEY = 'preferredCountry';

export const getPreferredCountry = () => {
  return localStorage.getItem(STORAGE_KEY) || '';
}

export const setPreferredCountry = (code) => {
  if (code) {
    localStorage.setItem(STORAGE_KEY, code);
  }
}
