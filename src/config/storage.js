export const StorageService = {
  setItem: (key, item) => {
    window.localStorage.setItem(key, JSON.stringify(item));
  },
  getItem: (key) => {
    const data = window.localStorage.getItem(key);
    if (!data) return null;
    let obj;
    try {
      obj = JSON.parse(data);
    } catch (error) {
      obj = null;
    }
    return obj;
  },
  clearItem: (key) => {
    window.localStorage.removeItem(key);
  },
  clearAll: () => {
    window.localStorage.clear();
  },
};
