const {contextBridge, ipcRenderer} = require("electron")


contextBridge.exposeInMainWorld("api", {
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
    settingsToUi: (settings) => ipcRenderer.on('settingsToUi', settings),
    settingsToCore: (channel, settings) => ipcRenderer.invoke(channel, settings),
    openPathDialog: (channel, data) => ipcRenderer.invoke(channel, data),
    sendPathToMinecraft: (path) => ipcRenderer.on('sendPathToMinecraft', path),
    loadingProgressEvent: (data) => ipcRenderer.on('loadingProgressEvent', data),
    launchingProgressEvent: (data) => ipcRenderer.on('launchingProgressEvent', data),
    leave: (channel, data) => ipcRenderer.invoke(channel, data),
    levelsData: (data) => ipcRenderer.on('levelsData', data),
    importLevel: (channel, data) => ipcRenderer.invoke(channel, data),
    importLevelEvent: (data) => ipcRenderer.on('importLevelEvent', data),
    
})

