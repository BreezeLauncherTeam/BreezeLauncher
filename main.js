
const { app, BrowserWindow, ipcMain, url } = require('electron')
const path = require('path');
const zlib = require('zlib')
const nbt = require('nbt-js')
const fs = require("fs")
const detect = require('detect-file-type')
const unzipper = require("unzipper")
const archiver = require('archiver');
const { Client, Authenticator } = require('minecraft-launcher-core');
const launcher = new Client();
const { dialog } = require('electron')
const { exec } = require('child_process');
const { loadEnvFile } = require('process');
const { json } = require('stream/consumers');
const { type } = require('os');
const LAUNCHER_PATH = "D:/breeze-launcher/"
const LAUNCHER_SETTINGS_PATH = "D:/breeze-launcher/settings.json"


const DEFAULT_SETTINGS = {
    username: "Steve",
    min_memory: "2G",
    max_memory: "2G",
    language: "en_US",
    minecraft_version: "1.21",
    minecraft_version_type: "release",
    minecraft_path: "D:\\minecraft",
    export_path: "D:\\",
    installed_versions: []
}

const GAMETYPES = ["gametype_survival", "gametype_creative", "gametype_adventure", "gametype_spectator"]

let settings = {}


function getSettings() {
    try {
        let data = fs.readFileSync(LAUNCHER_SETTINGS_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Read file error:', err);
        return null;
    }
}

function setSettings() {
    try {
        fs.writeFileSync(LAUNCHER_SETTINGS_PATH, JSON.stringify(settings));
    } catch (err) {
        console.error('Write file error:', err);
    }
}

function loadVersionsIds(startPath) {
    if (!fs.existsSync(startPath)) {
        console.log(`[ERROR]: Path ${startPath} not found`);
        return false
    }

    let versionsIds = []
    const files = fs.readdirSync(startPath);
    let types = []

    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(startPath, files[i]);
        const stat = fs.lstatSync(filePath);
        
        if (stat.isDirectory()) {

            const necessaryFiles = fs.readdirSync(filePath)
            let exts = []
            let names = []
            for (let j = 0; j < necessaryFiles.length; j++) {
                exts = [...exts, path.parse(necessaryFiles[j]).ext]
                names = [...names, path.parse(necessaryFiles[j]).name]
            }
            try {
                types = [...types,  JSON.parse(fs.readFileSync(path.join(filePath, "\\" + necessaryFiles[1]))).type]
            } catch(e) {
                console.log("[ERROR]: ", e.message)
            }
            if (exts.includes(".jar") && exts.includes(".json") && names[0] == names[1]) {
                versionsIds = [...versionsIds, {id: names[0]}]
            }
        }
    }
    for (let i = 0; i < types.length; i++) {
        versionsIds[i].type = types[i]         
    }
    return versionsIds
}



function loadLevelsData(startPath, fileName) {
    if (!fs.existsSync(startPath)) {
        console.log(`[ERROR]: Path ${startPath} not found`);
        return false
    }
    let f = []
    let foldersWithFile = [];
    const files = fs.readdirSync(startPath);

    for (let i = 0; i < files.length; i++) {
        const filePath = path.join(startPath, files[i]);
        const stat = fs.lstatSync(filePath);

        if (stat.isDirectory()) {
            const targetFilePath = path.join(filePath, fileName);

            if (fs.existsSync(targetFilePath)) {
                foldersWithFile.push(filePath);
                f.push({ level: targetFilePath, icon: filePath + "\\icon.png", folder: filePath })
            }
            const result = loadLevelsData(filePath, fileName);
            foldersWithFile = foldersWithFile.concat(result);
        }
    }
    return f;
}

function loadLevels() {
    let files = loadLevelsData(settings.minecraft_path + "\\saves", 'level.dat')
    let levelsData = []
    for (let i = 0; i < files.length; i++) {

        let file = fs.readFileSync(files[i].level)
        let level = zlib.gunzipSync(file)
        let tag = nbt.read(level)

        let icon = fs.readFileSync(files[i].icon)

        levelsData = [...levelsData, {
            levelName: tag.payload[''].Data.LevelName,
            gameType: GAMETYPES[tag.payload[''].Data.GameType],
            isHardcore: tag.payload[''].Data.hardcore,
            icon: "data:image/png;base64," + new Buffer.from(icon).toString('base64'),
            folderPath: files[i].folder,
        }]
    }

    webContents.send('levelsData', levelsData)
}

function createLevelFolderName(firstName) {
    if (fs.existsSync(settings.minecraft_path + "\\saves\\" + firstName)) {
        return createLevelFolderName(firstName + "1") 
    } else {
        return firstName
    }
}

function createFileName(dir, firstName, ext) {
    if (fs.existsSync(dir + firstName + "." + ext)) {
        return createFileName(dir, firstName + "1", ext) 
    } else {
        return firstName
    }
}

function isValidSettings(settings, defaultSett) {
    let settingsKeys = []
    let defaultKeys = []

    for (let key in settings) {
        settingsKeys = [...settingsKeys, key]
    }

    for (let key in defaultSett) {
        defaultKeys = [...defaultKeys, key]
    }

    console.log(defaultKeys, settingsKeys)

    if (JSON.stringify(settingsKeys) === JSON.stringify(defaultKeys)) {
        return true
    }
}

(async () => {
    if (!fs.existsSync(LAUNCHER_PATH));
    await fs.mkdir(LAUNCHER_PATH, () => { })

    if (getSettings() && isValidSettings(getSettings(), DEFAULT_SETTINGS)) {
        settings = getSettings()
    } else {
        settings = DEFAULT_SETTINGS
        setSettings()
    }

})()



let webContents

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1000,
        height: 700,
        autoHideMenuBar: true,
        icon: "./assets/icon.ico",
        webPreferences: {
            sandbox: false,
            preload: path.join(__dirname, './preload.js'),
            nodeIntegration: true,
        },
    })

    webContents = win.webContents

    win.loadURL(`file://${__dirname}/index.html`).then(() => {
        settings.installed_versions = loadVersionsIds(settings.minecraft_path + "\\versions")
        setSettings()
        win.webContents.send('settingsToUi', settings)
        loadLevels()

    })
    win.webContents.openDevTools()
}

app.whenReady().then(() => {
    createWindow()
})


exec("java -verson", (err, stdout, stderr) => {
    if (err) {
        console.log("No java availeble")
    } else {
        console.log(stdout)
    }
    console.log(stderr, stdout)
})

ipcMain.handle('loadLevels', (e, data) => {
    loadLevels()
})

ipcMain.handle('settingsToCore', (e, sett) => {
    settings = sett
    setSettings()
})

ipcMain.handle('openPathDialog', (e, openFor) => {
    let options = {
        properties: ["openDirectory"]
    }
    dialog.showOpenDialog(options).then((data) => {
        webContents.send("sendPath", {
            path: data.filePaths[0],
            for: openFor,
        })
    })
})

ipcMain.handle("leave", (e) => {
    app.quit()
})

ipcMain.handle("exportLevel", (e, data) => {

    let splitName = data.split("\\")
    let sourceDir = data
    
    const archive = archiver('zip', { zlib: { level: 9 } }); 
    const stream = fs.createWriteStream(settings.export_path + createFileName(settings.export_path, splitName[splitName.length - 1], "zip") + ".zip");

    let p = new Promise((resolve, reject) => { 
        archive.directory(sourceDir, false).on('error', err => reject(err)) .pipe(stream);
        stream.on('close', () => resolve()); 
        archive.finalize(); 
    });

    p.then(() => {
        webContents.send("exportLevelEvent", {
            isSuccess: true,
        })
    })
})

ipcMain.handle("importLevel", (e) => {
    dialog.showOpenDialog({
        filters: [{ extensions: ["zip"] }],
        properties: ['openFile'],
    }).then((files) => {
        if (files.canceled) return;

        let validExternitions = ["zip"]


        detect.fromFile(files.filePaths[0], function (err, res) {
            if (validExternitions.includes((res ?? {ext: ""}).ext)) {

               
                let splitName = files.filePaths[0].split("\\")
                let levelName = splitName[splitName.length - 1].substring(0, splitName[splitName.length - 1].length - 4)
                

                fs.createReadStream(files.filePaths[0]).pipe(unzipper.Extract({ path: settings.minecraft_path + `\\saves\\${createLevelFolderName(levelName + " (imported by breeze launcher)")}` })).
                    on('close', () => {
                        loadLevels()
                        webContents.send("importLevelEvent", {
                            isMinecraftWorld: true,
                            isSuccess: true,
                            errorCode: 0,
                        })
                    })

            } else {
                webContents.send("importLevelEvent", {
                    isMinecraftWorld: false,
                    isSuccess: false,
                    errorCode: "NOT-VALID-FILE-EXTENSION",
                })
            }
        })
    })
})

ipcMain.handle('run-game', (e) => {
    let opts = {
        authorization: Authenticator.getAuth(settings.username, false),
        root: settings.minecraft_path,
        version: {
            number: settings.minecraft_version,
            type: settings.minecraft_version_type,
        },
        memory: {
            max: settings.max_memory,
            min: settings.min_memory
        }
    }
    launcher.launch(opts);

    launcher.on("download-status", (e) => {
        try {
            webContents.send("loadingProgressEvent", e)
        }
        catch {
            console.log("[ERROR]: Downloading abort")
        }
    })

    launcher.on("progress", (e) => {
        try {
            webContents.send("launchingProgressEvent", e)
        }
        catch {
            console.log("[ERROR]: Launching abort")
        }
    })

})


