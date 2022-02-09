/* eslint-disable no-unused-vars */
'use strict'

import { app, protocol, BrowserWindow, dialog, ipcMain } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import ElectronStore from 'electron-store'
import { BODY_NAME } from './helper/consts'
import PSD from 'psd.js'

const isDevelopment = process.env.NODE_ENV !== 'production'
ElectronStore.initRenderer()

let lastSelectedPath = app.getPath('downloads')

function registerLocalResourceProtocol () {
  protocol.registerFileProtocol('local-resource', (request, callback) => {
    const url = request.url.replace(/^local-resource:\/\//, '')
    const decodedUrl = decodeURIComponent(url)
    try {
      return callback(decodedUrl)
    } catch (error) {
      console.error('ERROR: registerLocalResourceProtocol: Could not get file path:', error)
    }
  })
}

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1080,
    height: 720,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
}

ipcMain.on('openDir', (e) => {
  const browserWindow = BrowserWindow.fromBrowserView(e.sender)
  const selectedPaths = dialog.showOpenDialogSync(browserWindow, {
    title: '打开任务文件夹',
    buttonLabel: '选择',
    defaultPath: lastSelectedPath,
    properties: ['openDirectory']
  }) || [lastSelectedPath]
  const [selectedPath] = selectedPaths
  lastSelectedPath = selectedPath || lastSelectedPath
  e.returnValue = selectedPath
})

ipcMain.on('saveDir', (e) => {
  const browserWindow = BrowserWindow.fromBrowserView(e.sender)
  const selectedPaths = dialog.showOpenDialogSync(browserWindow, {
    title: '保存脚本和资源',
    buttonLabel: '导出到此处',
    defaultPath: app.getPath('downloads'),
    properties: ['openDirectory']
  }) || []
  const [selectedPath] = selectedPaths
  e.returnValue = selectedPath
})

ipcMain.on('getContainerName', (e) => {
  const browserWindow = BrowserWindow.fromBrowserView(e.sender)
  const [psdPath] = dialog.showOpenDialogSync(browserWindow, {
    title: '打开PSD',
    buttonLabel: '选择',
    filters: [
      { name: '模版', extensions: ['psd'] }
    ],
    properties: ['openFile']
  }) || []
  if (psdPath) {
    const psd = PSD.fromFile(psdPath)
    psd.parse()
    const [bodyGroup] = psd.tree().childrenAtPath(BODY_NAME) || []
    if (bodyGroup) {
      if (bodyGroup.hasChildren('组1')) {
        e.returnValue = '组1'
      } else {
        e.returnValue = '组 1'
      }
    } else {
      e.returnValue = null
    }
  } else {
    e.returnValue = null
  }
})

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
  registerLocalResourceProtocol()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
