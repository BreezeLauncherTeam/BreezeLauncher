const {contextBridge, ipcRenderer} = require("electron")


contextBridge.exposeInMainWorld("api", {
    invoke: (channel, data) => ipcRenderer.invoke(channel, data),
    settingsToUi: (settings) => ipcRenderer.on('settingsToUi', settings),
    settingsToCore: (channel, settings) => ipcRenderer.invoke(channel, settings),
    openPathDialog: (channel, data) => ipcRenderer.invoke(channel, data),
    sendPath: (path) => ipcRenderer.on('sendPath', path),
    loadingProgressEvent: (data) => ipcRenderer.on('loadingProgressEvent', data),
    launchingProgressEvent: (data) => ipcRenderer.on('launchingProgressEvent', data),
    leave: (channel, data) => ipcRenderer.invoke(channel, data),
    levelsData: (data) => ipcRenderer.on('levelsData', data),
    loadLevels: (channel, data) => ipcRenderer.invoke(channel, data),
    importLevel: (channel, data) => ipcRenderer.invoke(channel, data),
    importLevelEvent: (data) => ipcRenderer.on('importLevelEvent', data),
    exportLevel: (channel, data) => ipcRenderer.invoke(channel, data),
    exportLevelEvent: (data) => ipcRenderer.on('exportLevelEvent', data),
})

