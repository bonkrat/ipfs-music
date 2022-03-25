require("dotenv").config();
const electron = require("electron");
// For over the air updates
// const { autoUpdater } = require('electron-updater')
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const Menu = electron.Menu;
const path = require("path");
const isDev = require("electron-is-dev");
const http = require("http");
const finalhandler = require("finalhandler");
const serveStatic = require("serve-static");
const webtorrentWin = require("./webtorrent");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    minWidth: 530,
    titleBarStyle: "hiddenInset",
    webPreferences: {
      webSecurity: false,
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
    },
  });

  mainWindow.loadURL(
    isDev
      ? "http://localhost:3000"
      : `file://${path.join(__dirname, "../build/index.html")}`
  );
  if (isDev) {
    // Open the DevTools.
    //BrowserWindow.addDevToolsExtension('<location to your react chrome extension>');
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on("closed", () => (mainWindow = null));
}

/**
 * Used to handle selecting a directory
 * https://jaketrent.com/post/select-directory-in-electron/
 */
electron.ipcMain.on("select-dirs", async (event, arg) => {
  const result = await electron.dialog.showOpenDialog(mainWindow, {
    properties: ["openDirectory"],
  });
  event.reply("music-dir-select", result.filePaths);
});

var server;

electron.ipcMain.on("start-static-server", async (event, musicDir) => {
  if (server) {
    server.close(() => console.log("Closing server..."));
  }

  var serve = serveStatic(musicDir);

  // Create server
  server = http.createServer(function onRequest(req, res) {
    serve(req, res, finalhandler(req, res));
  });

  try {
    server.listen(5001);
  } catch (error) {
    console.log("PORT TAKEN");
  }
});

app.allowRendererProcessReuse = true;
app.setName("seeek");

const template = [
  {
    label: app.name,
    submenu: [{ role: "about" }],
  },
];

const menu = new Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

app.on("ready", () => {
  createWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
