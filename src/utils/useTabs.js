import { useState, useEffect } from "react";
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

  const addTab = () => {
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
  };

  const deleteTab = (event) => {
    // Prevent MaterialUI from switching tabs
    event.stopPropagation();

    // Prevent deleting the last tab
    if (tabs.length === 1) {
      return;
    }

    const tabId = parseInt(event.target.id, 10);
    let tabIdIndex = 0;

    const tabList = tabs.filter((tab, index) => {
      if (tab.id === tabId) {
        tabIdIndex = index;
        localStorage.removeItem(tab.key);
      }
      return tab.id !== tabId;
    });

    if (tabIdIndex !== 0) {
      setValue(tabIdIndex - 1)
    }

    saveTabs(tabList);
  };

  const handleTabChange = (_event, newValue) => {
    if (newValue === tabs.length) {
      addTab();
    } else {
      setValue(newValue);
    }
  };

  return {
    value,
    setValue,
    tabs,
    saveTabs,
    addTab,
    deleteTab,
    handleTabChange,
  };
};

export default useTabs;
