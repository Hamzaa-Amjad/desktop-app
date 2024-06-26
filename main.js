// Modules to control application life and create native browser window
const { app, BrowserWindow ,autoUpdater,desktopCapturer,ipcMain} = require('electron')
const path = require('node:path')


// Set the URL where the latest version of your app is hosted
const updateUrl = 'https://github.com/Hamzaa-Amjad/electron-desktop-app'

// Check for updates when the app is ready
app.whenReady().then(() => {
  autoUpdater.setFeedURL(updateUrl)
  autoUpdater.checkForUpdates()
})

// Listen for update download progress events
autoUpdater.on('download-progress', (progress) => {
  console.log(`Download progress: ${progress.percent}%`)
})

// Listen for update downloaded events
autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Update Available',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail: 'A new version of the app is available. Restarting the app will install the update.'
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})


function createWindow () {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
ipcMain.handle('get-sources', async () => {
  const sources = await desktopCapturer.getSources({ types: ['screen', 'window'] });
  console.log("getSources in app.js");
  console.log("sources:::",sources)
  return sources;
});
