import { useState, useCallback, useLayoutEffect } from "react";
import { useHash } from "react-use";

const toHash = (filters) => filters.join(" ").trimEnd().split(" ").join(",");

const fromHash = (hash = "") => {
  const hashFilters = hash.slice(1).split("-");
  return Array.from({ length: 13 }).map(
    (v, i) => Number(hashFilters[i]) || undefined
  );
};

const hasHash = (hash) => Boolean(hash);

const useShare = (filters) => {
  const [hash, setHash] = useHash();
  const [open, setOpen] = useState(true);

  const shareFilters = fromHash(hash);
  const showShareDialog = hasHash(hash) && open;
  const onCloseShareModal = useCallback(() => {
    setOpen(false);
    setHash("");
  }, [setHash]);
  const openShareDialog = useCallback(() => {
    setHash(toHash(filters) || "000");
    setOpen(true);
  }, [filters, setHash]);

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
