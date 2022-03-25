import { useState } from "react";
import { createContainer } from "unstated-next";
import store from "../utils/store";

const currentSettings = store.getAll();

export default createContainer(() => {
  const [settings, setSettings] = useState(currentSettings);

  return {
    setUserSettings: updates => {
      const newSettings = {
        ...settings,
        ...updates
      };

      Object.keys(updates).forEach(key => {
        store.set(key, updates[key]);
      });

      setSettings(() => newSettings);
    },
    ...settings
  };
});
