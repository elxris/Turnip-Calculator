import { useState, useCallback } from "react";
import { useHash } from "react-use";
import useFilters from "./useFilters";

const toHash = (filters) => filters.join(" ").trimEnd().split(" ").join(",");

const fromHash = (hash) => {
  const hashFilters = hash.slice(1).split(",");
  return Array.from({ length: 13 }).map(
    (v, i) => Number(hashFilters[i]) || undefined
  );
};

const hasHash = (hash) => Boolean(hash.slice(1));

const useShare = (filters) => {
  const [hash, saveHash] = useHash();
  const [open, setOpen] = useState(true);

  const shareFilters = fromHash(hash);
  const showShareModal = hasHash(hash) && open;
  const onCloseShareModal = useCallback(() => {
    setOpen(false);
  }, []);
  const onShare = useCallback(() => {
    saveHash(toHash(filters));
  }, [filters]);

  return {
    shareFilters,
    showShareModal,
    onCloseShareModal,
    onShare,
  };
};

export default useShare;
