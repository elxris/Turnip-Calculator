import { useState, useCallback, useLayoutEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import QueryString from "qs";

const toHash = (filters) =>
  filters
    .join(" ")
    .replace(/(\s*$)/g, "")
    .split(" ")
    .join("-") || "000";

const fromHash = (hash = "") => {
  const hashFilters = hash.replace("#", "").replace(/,/g, "-").split("-");
  return Array.from({ length: 13 }).map(
    (v, i) => Number(hashFilters[i]) || undefined
  );
};

const hasHash = (hash) => Boolean(hash);

const useShare = (filters) => {
  const [open, setOpen] = useState(true);
  const { search, hash } = useLocation();
  const history = useHistory();
  const { f } = QueryString.parse(search, { ignoreQueryPrefix: true });

  const shareFilters = fromHash(f || hash);
  const showShareDialog = hasHash(f || hash) && open;
  const onCloseShareModal = useCallback(() => {
    setOpen(false);
    history.replace({
      search: null,
      hash: null,
    });
  }, [history]);
  const openShareDialog = useCallback(() => {
    history.replace({
      pathname: "share",
      search: QueryString.stringify(
        { f: toHash(filters) },
        { addQueryPrefix: true }
      ),
      hash: null,
    });
    setOpen(true);
  }, [filters, history]);

  useLayoutEffect(() => {
    if (f || hash) {
      history.replace({
        pathname: "share",
        search: QueryString.stringify({ f: toHash(shareFilters) }),
        hash: null,
      });
      setOpen(true);
    }
    // onMount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history]);

  return {
    shareFilters,
    showShareDialog,
    onCloseShareModal,
    openShareDialog,
  };
};

export default useShare;
export { toHash };
