const fs = require("fs")

const LAUNCHER_SETTINGS_PATH = "D:/craddylauncher/settings.json"


const DEFAULT_SETTINGS = {
    username: "Steve",
    min_memory: "4G",
    max_memory: "6G",
    language: "en_US",
    minecraft_version: "1.21",
    minecraft_version_type: "relese",
}

const SETTINGS = {}


function getSettings() {
    try {
        const data = fs.readFileSync(LAUNCHER_SETTINGS_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
        return null;
    }
}

export function setSettings() {
    try {
        fs.writeFileSync(LAUNCHER_SETTINGS_PATH, JSON.stringify(data, null, 2));
    } catch (err) {
        console.error('Ошибка записи файла:', err);
    }
}


if (getSettings()) {
    SETTINGS = getSettings()
} else {
    SETTINGS = DEFAULT_SETTINGS
    setSettings()
}


/*
const fs = require('fs');
const filePath = './data.json';

// Данные для записи
const newData = { name: 'John', age: 30 };

// Функция для чтения данных из файла
function readData() {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
        return null;
    }
}

// Функция для записи данных в файл
function writeData(data) {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        console.log('Данные успешно записаны в файл');
    } catch (err) {
        console.error('Ошибка записи файла:', err);
    }
}

// Проверка существования файла и выполнение соответствующих действий
if (fs.existsSync(filePath)) {
    console.log('Файл существует. Чтение данных...');
    const existingData = readData();
    if (existingData) {
        // Обновление данных
        const updatedData = { ...existingData, ...newData };
        writeData(updatedData);
    }
} else {
    console.log('Файл не существует. Создание нового файла...');
    writeData(newData);
}

*/
