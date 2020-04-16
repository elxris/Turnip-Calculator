import { useState, useCallback, useLayoutEffect } from "react";
import { useHash } from "react-use";

const toHash = (filters) =>
  filters
    .join(" ")
    .replace(/(\s*$)/g, "")
    .split(" ")
    .join("-");

const fromHash = (hash = "") => {
  const hashFilters = hash.slice(1).split("-");
  return Array.from({ length: 13 }).map(
    (v, i) => Number(hashFilters[i]) || undefined
  );
};

const hasHash = (hash) => Boolean(hash);

const setHash = (hash) => {
  if (window.history.replaceState) {
    window.history.replaceState(null, null, `#${hash}`);
  } else {
    window.location.hash = `#${hash}`;
  }
};

const useShare = (filters) => {
  const [$hash] = useHash();
  const [open, setOpen] = useState(1);
  const hash = $hash || window.location.hash;

  const shareFilters = fromHash(hash);
  const showShareDialog = hasHash(hash) && open;
  const onCloseShareModal = useCallback(() => {
    setOpen(false);
    setHash("");
  }, []);
  const openShareDialog = useCallback(() => {
    setHash(toHash(filters) || "000");
    setOpen(true);
  }, [filters]);

  useLayoutEffect(() => {
    if (hash) {
      setOpen(true);
    }
  }, [hash]);

  return {
    shareFilters,
    showShareDialog,
    onCloseShareModal,
    openShareDialog,
  };
};

export default useShare;
export { toHash };
