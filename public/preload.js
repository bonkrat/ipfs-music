const electron = require("electron");

process.once("loaded", () => {
  window.addEventListener("message", evt => {
    if (evt.data.type === "select-dirs") {
      electron.ipcRenderer.send("select-dirs");
    }
  });
});
