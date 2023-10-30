require("dotenv").config()
require("dotenv").config({path:'./../.env'})
require("dotenv").config({path:'./../../.env'})
require("dotenv").config({path:'./../../../.env'})
require("dotenv").config({path:'./../../../../.env'})

import { app, BrowserWindow, shell, ipcMain } from 'electron'
import { release } from 'node:os'
import { join } from 'node:path'
import { update } from './update'

/*
  Wallet Connect
 */
import { initializeWallets } from './walletconnect/index'
import useWalletConnectEventsManager from './walletconnect/events'
import { web3wallet } from './walletconnect/utils/WalletConnectUtil'
import { EIP155_SIGNING_METHODS } from './walletconnect/data/EIP155Data'
import { approveEIP155Request, rejectEIP155Request } from './walletconnect/utils/EIP155RequestHandlerUtil'
//end WC

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ dist
// │ └── index.html    > Electron-Renderer
//
process.env.DIST_ELECTRON = join(__dirname, '../')
process.env.DIST = join(process.env.DIST_ELECTRON, '../dist')
process.env.VITE_PUBLIC = process.env.VITE_DEV_SERVER_URL
  ? join(process.env.DIST_ELECTRON, '../public')
  : process.env.DIST

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
  app.quit()
  process.exit(0)
}

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null
// Here, you can also use other preload
const preload = join(__dirname, '../preload/index.js')
const url = process.env.VITE_DEV_SERVER_URL
const indexHtml = join(process.env.DIST, 'index.html')

async function createWindow() {
  win = new BrowserWindow({
    title: 'Main window',
    icon: join(process.env.VITE_PUBLIC, 'favicon.ico'),
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (url) { // electron-vite-vue#298
    win.loadURL(url)
    // Open devTool if the app is not packaged
    win.webContents.openDevTools()
  } else {
    win.loadFile(indexHtml)
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString())
  })

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('https:')) shell.openExternal(url)
    return { action: 'deny' }
  })

  // Apply electron-updater
  update(win)
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
  win = null
  if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore()
    win.focus()
  }
})

app.on('activate', () => {
  const allWindows = BrowserWindow.getAllWindows()
  if (allWindows.length) {
    allWindows[0].focus()
  } else {
    createWindow()
  }
})

// New window example arg: new windows url
ipcMain.handle('open-win', (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
      nodeIntegration: true,
      contextIsolation: false,
    },
  })

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`)
  } else {
    childWindow.loadFile(indexHtml, { hash: arg })
  }
})

/*
    onStart

 */

// let onStart = async function(){
//   try{
//     console.log("STARTING UP")
//     const initialized = await initializeWallets()
//
//   }catch(e){
//     console.error(e)
//   }
// }
// onStart()

//perform_skill_by_id
ipcMain.on('onStart', async (event, message) => {
  try{
    console.log("STARTING UP")
    const initialized = await initializeWallets(event)
    useWalletConnectEventsManager(initialized, event)
  }catch(e){
    console.error("e: ",e)
  }
});

ipcMain.on('approveSession', async (event, message) => {
  try{
    console.log("approveSession", message)
    await web3wallet.approveSession(message)
  }catch(e){
    console.error("e: ",e)
  }
});

ipcMain.on('rejectSession', async (event, message) => {
  try{
    console.log("rejectSession", message)
    await web3wallet.rejectSession(message)
  }catch(e){
    console.error("e: ",e)
  }
});


ipcMain.on('approveSessionRequest', async (event, message) => {
  try{
    console.log("approveSessionRequest", message)
    console.log("approveSessionRequest", message.requestEvent)
    const { topic, params, verifyContext } = message.requestEvent
    console.log("topic: ", topic)
    console.log("params: ", params)
    console.log("verifyContext: ", verifyContext)
    const { request } = params
    console.log("request", request)
    //types of messages
    switch (request.method) {
      case EIP155_SIGNING_METHODS.ETH_SIGN:
      case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
        const response = await approveEIP155Request(message.requestEvent)
        console.log("response: ",response)
        await web3wallet.respondSessionRequest({
          topic,
          response
        })
        return true
      default:
        console.error("Unhandled event type! "+request.method)
        return false
    }

  }catch(e){
    console.error("e: ",e)
  }
});

ipcMain.on('rejectSessionRequest', async (event, message) => {
  try{
    console.log("rejectSessionRequest", message)
    console.log("rejectSessionRequest", message.requestEvent)
    const { topic, params, verifyContext } = message.requestEvent
    const { request } = params
    //types of messages
    switch (request.method) {
      case EIP155_SIGNING_METHODS.ETH_SIGN:
      case EIP155_SIGNING_METHODS.PERSONAL_SIGN:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V3:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TYPED_DATA_V4:
      case EIP155_SIGNING_METHODS.ETH_SEND_TRANSACTION:
      case EIP155_SIGNING_METHODS.ETH_SIGN_TRANSACTION:
        const response = await rejectEIP155Request(message.requestEvent)
        await web3wallet.respondSessionRequest({
          topic,
          response
        })
        return true
      default:
        console.error("Unhandled event type! "+request.method)
        return false
    }

  }catch(e){
    console.error("e: ",e)
  }
});

/*
    IPC
    Functions Provided to the Renderer
 */

//perform_skill_by_id
// ipcMain.on('pair', async (event, message) => {
//     console.log("PAIR", message)
//     let uri = message
//     console.log("web3wallet", web3wallet)
//     if(web3wallet){
//       web3wallet.pair({ uri })
//       //event.reply('asynchronous-reply', 'pong')
//     }
//
//     event.reply('pair', message)
// });


/*
    events
 */

//open session
