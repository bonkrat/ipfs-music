import React from "react";
import UserSettings from "../containers/UserSettings";
import { ipcRenderer } from "electron";
import { classnames } from "tailwindcss-classnames";

const settingStyles = {
  setting: classnames(
    "flex",
    "justify-between",
    "text-gray-500",
    "font-thin",
    "align-middle",
    "cursor-pointer",
    "mb-2"
  ),
  value: classnames(
    "bg-gray-800",
    "text-gray-200",
    "px-4",
    "py-1",
    "rounded-md"
  ),
  description: classnames("font-normal"),
};

const Setting = ({ setting, value, changeSetting }) => (
  <>
    <div className={settingStyles.setting} onClick={changeSetting}>
      <div>{setting}</div>
      <div className={settingStyles.value}>{value}</div>
    </div>
  </>
);

const labelStyles = {
  label: classnames(
    "text-2xl",
    "mb-8",
    "border-b",
    "py-4",
    "border-gray-700",
    "text-gray-200"
  ),
};

const SettingsLabel = ({ children }) => (
  <div className={labelStyles.label}>{children}</div>
);

const Settings = () => {
  const { musicDir, setUserSettings } = UserSettings.useContainer();

  /**
   * https://jaketrent.com/post/select-directory-in-electron/
   * Done using electron since you cannot select an empty directory with <input>
   */
  ipcRenderer.on("music-dir-select", (event, filePaths) => {
    const dir = filePaths && filePaths.length ? filePaths[0] : musicDir;
    setUserSettings({ musicDir: dir });
  });

  const handleFileSelect = () => {
    window.postMessage({
      type: "select-dirs",
    });
  };

  return (
    <div className="fade-in">
      <SettingsLabel>General</SettingsLabel>
      <Setting
        setting="Downloads Directory"
        value={musicDir}
        // description={downDirDesc}
        changeSetting={(event) => handleFileSelect(event)}
      />
    </div>
  );
};

export default Settings;
