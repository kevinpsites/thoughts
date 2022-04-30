import useLocalStorage from "./useLocalStorage";

function useLocalStorageItem<T>(
  storageKey: string
): [
  getItem: () => T | null,
  setItem: (storageValue: T) => void,
  clearItem: () => void
] {
  const { getLocalKey, setLocalKey, clearLocalKey } = useLocalStorage();

  const getItem = (): T | null => {
    return getLocalKey(storageKey);
  };

  const setItem = <T,>(storageValue: T): void => {
    setLocalKey(storageKey, storageValue);
  };

  const clearItem = (): void => {
    clearLocalKey(storageKey);
  };

  return [getItem, setItem, clearItem];
}

export default useLocalStorageItem;
