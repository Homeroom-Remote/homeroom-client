const path = require("path");

const { app, BrowserWindow } = require("electron");
const isDev = require("electron-is-dev");

function createWindow() {
  const win = new BrowserWindow({
    minWidth: 1024,
    width: 1024,
    minHeight: 768,
    height: 768,
    frame: false,
    transparent: false,
    webPreferences: {
      nodeIntegration: true,
    },
    icon: path.join(__dirname, "apple-icon-72x72.png"),
  });

  let appUrl = `file://${path.join(__dirname, "../build/index.html")}`;

  if (isDev) {
    appUrl = "http://localhost:3000";
    win.webContents.openDevTools({ mode: "detach" }); // Open dev tools
  }

  win.loadURL(appUrl);
}

// This method is called when Electron has finished
// initialization and can create browser windows.
app.whenReady().then(createWindow);

//////////////////
// Lifecycle Hooks
//////////////////
app.on("window-all-closed", () => {
  if (process.platform !== "darwing") {
    // darwing = macOS
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
