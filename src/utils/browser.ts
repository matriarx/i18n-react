export const getLocalStorageItem = (id: string): string | object | null =>
  JSON.parse(localStorage.getItem(id) || 'null')

export const setLocalStorageItem = (id: string, value: string | object): void =>
  localStorage.setItem(id, JSON.stringify(value))

export const getSessionStorageItem = (id: string): string | object | null =>
  JSON.parse(sessionStorage.getItem(id) || 'null')

export const setSessionStorageItem = (
  id: string,
  value: string | object,
): void => sessionStorage.setItem(id, JSON.stringify(value))

export default {
  getLocalStorageItem,
  setLocalStorageItem,
  getSessionStorageItem,
  setSessionStorageItem,
}
