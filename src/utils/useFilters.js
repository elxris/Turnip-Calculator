import { useEffect, useMemo } from "react";
import { useLocalStorage } from "react-use";

const useFilters = () => {
  const [savedFilters, saveFilters] = useLocalStorage("filters", []);

  let filters = savedFilters;

  const inputFilters = useMemo(
    () =>
      Array.from({ length: 13 }).map((v, i) =>
        String(Number(filters[i]) || "")
      ),
    [filters]
  );

  const sanitizedFilters = useMemo(
    () => filters.map((v) => Number(v) || undefined),
    [filters]
  );

  useEffect(() => {
    if (!Array.isArray(filters)) {
      saveFilters([]);
    }
  }, [filters]);

  return { inputFilters, filters: sanitizedFilters, saveFilters };
};

export default useFilters;
