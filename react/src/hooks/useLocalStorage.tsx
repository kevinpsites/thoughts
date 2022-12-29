function useLocalStorage(): {
  getLocalKey: <T>(storageKey: string) => T | null;
  setLocalKey: <T>(storageKey: string, storageValue: T) => void;
  clearLocalKey: (storageKey: string) => void;
} {
  const getLocalKey = <T,>(storageKey: string): T | null => {
    let localVersion = localStorage.getItem(storageKey);

    if (!localVersion) {
      return null;
    }

    try {
      let parsedVersion: T;
      parsedVersion = JSON.parse(localVersion);

      return parsedVersion;
    } catch (error) {
      console.error("LocalStorage Error", error);
      return null;
    }
  };

  const setLocalKey = <T,>(storageKey: string, storageValue: T): void => {
    let localVersion = JSON.stringify(storageValue);
    localStorage.setItem(storageKey, localVersion);
  };

  const clearLocalKey = (storageKey: string): void => {
    localStorage.removeItem(storageKey);
  };

  return {
    getLocalKey,
    setLocalKey,
    clearLocalKey,
  };
}

export default useLocalStorage;
