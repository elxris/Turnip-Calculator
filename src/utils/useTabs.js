import { useState, useEffect, useCallback } from "react";
import { useLocalStorage } from "react-use";

const DEFAULT_TAB_LIST = [
  {
    id: 0,
    key: "filters-0",
  },
];

const useTabs = () => {
  const [value, setValue] = useState(0);
  const [tabs, saveTabs] = useLocalStorage("tablist", DEFAULT_TAB_LIST);

  useEffect(() => {
    if (!Array.isArray(tabs)) {
      saveTabs(DEFAULT_TAB_LIST);
    }
  }, [tabs, saveTabs]);

  const addTab = useCallback(() => {
    let id = 0
    for (id = 0; id < tabs.length; id++) {
      if (tabs[id].id !== id) {
        break;
      }
    }
    saveTabs([...tabs.slice(0, id), {
      id,
      key: `filters-${id}`,
    }, ...tabs.slice(id)]);
  }, [tabs, saveTabs]);

  const deleteTab = useCallback((event) => {
    // Prevent MaterialUI from switching tabs
    event.stopPropagation();

    // Prevent deleting the last tab
    if (tabs.length === 1) {
      return;
    }

    let deletedTabIndex = 0;
    const tabId = parseInt(event.target.id, 10);

    const tabList = tabs.filter((tab, index) => {
      if (tab.id === tabId) {
        deletedTabIndex = index;
        localStorage.removeItem(tab.key);
      }
      return tab.id !== tabId;
    });

    if (deletedTabIndex !== 0) {
      setValue(deletedTabIndex - 1)
    }

    saveTabs(tabList);
  }, [tabs, saveTabs]);

  const handleTabChange = useCallback((_event, newValue) => {
    if (newValue === tabs.length) {
      addTab();
    } else {
      setValue(newValue);
    }
  }, [tabs, addTab]);

  return {
    value,
    tabs,
    addTab,
    deleteTab,
    handleTabChange,
  };
};

export default useTabs;
