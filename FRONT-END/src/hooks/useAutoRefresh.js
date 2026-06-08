import { useEffect } from "react";
import { listenDataRefresh } from "../utils/dataRefresh";

const useAutoRefresh = (fetchFunction, intervalMs = 0) => {
  useEffect(() => {
    if (!fetchFunction) return;

    fetchFunction();

    const removeRefreshListener = listenDataRefresh(fetchFunction);

    const handleFocus = () => {
      fetchFunction();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        fetchFunction();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    let intervalId = null;

    if (intervalMs > 0) {
      intervalId = setInterval(() => {
        fetchFunction();
      }, intervalMs);
    }

    return () => {
      removeRefreshListener();
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);

      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchFunction, intervalMs]);
};

export default useAutoRefresh;
