import { useEffect, useMemo } from "react";
import { useLocalStorage } from "react-use";

const useFilters = (key) => {
  const [filters, saveFilters] = useLocalStorage(key, []);

  // Array of strings
  const inputFilters = useMemo(
    () =>
      Array.from({ length: 13 }).map((v, i) =>
        String(Number(filters[i]) || "")
      ),
    [filters]
  );

  // Array of numbers
  const sanitizedFilters = useMemo(
    () =>
      Array.from({ length: 13 }).map((v, i) => Number(filters[i]) || undefined),
    [filters]
  );

  useEffect(() => {
    if (!Array.isArray(filters)) {
      saveFilters([]);
    }
  }, [filters, saveFilters]);

  return {
    filters: sanitizedFilters,
    inputFilters,
    saveFilters,
  };
};

export default useFilters;
