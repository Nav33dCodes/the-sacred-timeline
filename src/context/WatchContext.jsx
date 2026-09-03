import { createContext, useContext, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const STORAGE_KEY = 'mcu_watched';

const WatchContext = createContext(null);

export const useWatch = () => {
  const ctx = useContext(WatchContext);
  if (!ctx) throw new Error('useWatch must be used inside <WatchProvider>');
  return ctx;
};

const readStored = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const WatchProvider = ({ children }) => {
  const [watched, setWatched] = useState(readStored);
  const isFirstRun = useRef(true);

  // Persist, but skip the mount pass so we never overwrite good data with [].
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watched));
    } catch {
      /* quota exceeded or private mode — progress just won't persist */
    }
  }, [watched]);

  // Keep multiple tabs in sync.
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === STORAGE_KEY) setWatched(readStored());
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  // O(1) membership tests — the timeline calls isWatched once per row.
  const watchedSet = useMemo(() => new Set(watched), [watched]);

  const toggleWatched = useCallback((id) => {
    setWatched((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  }, []);

  const isWatched = useCallback((id) => watchedSet.has(id), [watchedSet]);

  /** Mark every id in `ids` as watched, or clear them all if already complete. */
  const toggleMany = useCallback((ids) => {
    setWatched((prev) => {
      const set = new Set(prev);
      const allDone = ids.every((id) => set.has(id));
      ids.forEach((id) => (allDone ? set.delete(id) : set.add(id)));
      return [...set];
    });
  }, []);

  const clearAll = useCallback(() => setWatched([]), []);

  /** Percentage complete across an arbitrary list of entries. */
  const progressFor = useCallback(
    (list) => {
      if (!list?.length) return 0;
      const done = list.reduce((n, e) => n + (watchedSet.has(e.id ?? e) ? 1 : 0), 0);
      return Math.round((done / list.length) * 100);
    },
    [watchedSet],
  );

  const countFor = useCallback(
    (list) => (list ?? []).reduce((n, e) => n + (watchedSet.has(e.id ?? e) ? 1 : 0), 0),
    [watchedSet],
  );

  const value = useMemo(
    () => ({ watched, watchedSet, toggleWatched, toggleMany, isWatched, clearAll, progressFor, countFor }),
    [watched, watchedSet, toggleWatched, toggleMany, isWatched, clearAll, progressFor, countFor],
  );

  return <WatchContext.Provider value={value}>{children}</WatchContext.Provider>;
};
