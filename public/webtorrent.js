// Window for web torrent
function init() {
  console.log("its going!");

  const win = new electron.BrowserWindow({
    backgroundColor: "#1E1E1E",
    center: true,
    fullscreen: false,
    fullscreenable: false,
    height: 150,
    maximizable: false,
    minimizable: false,
    resizable: false,
    show: false,
    skipTaskbar: true,
    title: "webtorrent-hidden-window",
    useContentSize: true,
    webPreferences: {
      nodeIntegration: true,
      enableBlinkFeatures: "AudioVideoTracks",
    },
    width: 150,
  });

  win.loadURL(config.WINDOW_WEBTORRENT);

  // Prevent killing the WebTorrent process
  win.on("close", function (e) {
    if (electron.app.isQuitting) {
      return;
    }
    e.preventDefault();
    win.hide();
  });
}

module.exports = init;
