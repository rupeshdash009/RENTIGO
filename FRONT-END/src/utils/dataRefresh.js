export const DATA_REFRESH_EVENT = "rentigo:data-refresh";
export const DATA_REFRESH_STORAGE_KEY = "rentigo:data-refresh-time";

export const triggerDataRefresh = () => {
  const refreshTime = Date.now().toString();

  window.dispatchEvent(
    new CustomEvent(DATA_REFRESH_EVENT, {
      detail: { refreshTime },
    }),
  );

  localStorage.setItem(DATA_REFRESH_STORAGE_KEY, refreshTime);
};

export const listenDataRefresh = (callback) => {
  const handleWindowRefresh = () => {
    callback();
  };

  const handleStorageRefresh = (event) => {
    if (event.key === DATA_REFRESH_STORAGE_KEY) {
      callback();
    }
  };

  window.addEventListener(DATA_REFRESH_EVENT, handleWindowRefresh);
  window.addEventListener("storage", handleStorageRefresh);

  return () => {
    window.removeEventListener(DATA_REFRESH_EVENT, handleWindowRefresh);
    window.removeEventListener("storage", handleStorageRefresh);
  };
};
