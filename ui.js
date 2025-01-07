
import { lang, 
        LANGUAGE_NAMES, 
        getLanguage, 
        LANGUAGES, 
        languageValueParser
} from "./languages.js"

import SPLASHES from "./splashes.js";

let notificationAudio = new Audio("./sounds/Notification.mp3")

function program() {

    console.log(levelsData)

    const MAX_RAM_VALUES = [
        "2G",
        "4G",
        "8G",
    ]

    let selectedLevel = {
        folderPath: ""
    }

    function getRandomNumber(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

    async function getVersionsData() {
        document.querySelector(".play-screen__version-select-current-value-text").innerHTML = `<div class="lang" data-lang="play_screen_version_input_loading">${LANGUAGES[settings.language].play_screen_version_input_loading}</div>`;
        if (!navigator.onLine) {
            document.querySelector(".play-screen__version-select-current-value-text").textContent = settings.minecraft_version
            return { versions: [] }
        }
        let res = await fetch("https://piston-meta.mojang.com/mc/game/version_manifest.json")
        let json = await res.json()
        document.querySelector(".play-screen__version-select-current-value-text").textContent = settings.minecraft_version
        return json
    }


    function setVersions(versions) {
        const versionInputValuesContainer = document.querySelector('.play-screen__version-select-values-body')
        for (let i = 0; i < versions.length; i++) {
            let installed = `<div></div>`
            for (let j = 0; j < settings.installed_versions.length; j++) {
                if (versions[i].id === settings.installed_versions[j].id) {
                    //installed = `<div class="play-screen__version-select-installed lang" data-lang="play_screen_version_select_installed">${LANGUAGES[settings.language].play_screen_version_select_installed}</div>`
                }
            }
            const value = `<div class="select__value play-screen__version-select-value">
                        <span class="select__value-version play-screen__version-select-value-version">${versions[i].id}</span>
                            <div class="play-screen__version-select-meta">
                                <div class="play-screen__version-select-value-type">${versions[i].type}</div>
                                 ${installed}
                            </div>
                        </div></div>`
            versionInputValuesContainer.insertAdjacentHTML('beforeend', value)
            const versionInputValues = document.querySelectorAll('.play-screen__version-select-value')

            try {
                versionInputValues[i].addEventListener('click', (e) => {
                    e.stopPropagation()
                    document.querySelector(".play-screen__version-select").classList.remove("play-screen__version-select--active")
                    document.querySelector(".play-screen__version-select-current-value-text").textContent = document.querySelectorAll(".play-screen__version-select-value-version")[i].textContent

                    settings.minecraft_version = document.querySelectorAll(".play-screen__version-select-value-version")[i].textContent.split(' ')[0]
                    settings.minecraft_version_type = versions[i].type.toLowerCase()
                    console.log(settings)
                    window.api.settingsToCore('settingsToCore', settings)
                    document.querySelector(".play-screen__version-select").classList.remove("play-screen__version-select--active")
                    document.querySelector(".play-screen__version-select-arrow").style.transform = 'rotate(90deg)'
                })
            } catch { }
        }
    }

    function switchLanguage() {
        const langs = document.querySelectorAll(".lang")
        for (let i = 0; i <= langs.length; i++) {
            try {
                langs[i].textContent = lang(settings.language, langs[i].getAttribute("data-lang"))
            } catch { }
        }
    }


    function switchScreen(screenSelector) {
        const screens = document.querySelectorAll(".screen")
        for (let screen = 0; screen <= screens.length; screen++) {
            try {
                screens[screen].style.display = 'none'
            } catch { }
        }
        document.querySelector(screenSelector).style.display = 'block'
    }

    function loadLevels(levelsData) {
        document.querySelector(".saves-screen__levels").innerHTML = ""

        if (levelsData.length == 0) {
            let noLevels = `<div class="saves-screen__no-levels">
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="white" fill="none">
                                    <path d="M2.00024 2L22.0002 22" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                    <path d="M12.0005 21H8.00049C5.64347 21 4.46495 21 3.73272 20.2678C3.00049 19.5355 3.00049 18.357 3.00049 16V8C3.00049 5.64298 3.00049 4.46447 3.73272 3.73223M12.0005 21C14.3575 21 15.536 21 16.2683 20.2678C16.889 19.647 16.9835 18.7056 16.9979 16.9974M12.0005 21H17.0005C18.8861 21 19.8289 21 20.4147 20.4142M21.0005 16.9974V10C21.0005 8.11438 21.0005 7.17157 20.4147 6.58579C19.8289 6 18.8861 6 17.0005 6M17.0005 13.1109V8C17.0005 5.64298 17.0005 4.46447 16.2683 3.73223C15.536 3 14.3575 3 12.0005 3H8.00049C7.5983 3 7.23042 3 6.89321 3.00364" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>
                            <div class="saves-screen__no-levels-text lang" data-lang="saves_screen_no_levels_text">No levels</div>
                        </div>`
            document.querySelector(".saves-screen__levels").insertAdjacentHTML("beforeend", noLevels)
            switchLanguage()
        }

        for (let i = 0; i < levelsData.length; i++) {
            let gameType = `<div class="saves-screen__level-gametype lang" data-lang="${levelsData[i].gameType}">${LANGUAGES[settings.language][levelsData[i].gameType]}</div>`
            if (levelsData[i].isHardcore == 1) {
                gameType = `<div class="saves-screen__level-gametype lang" data-lang="gametype_hardcore">${LANGUAGES[settings.language].gametype_hardcore}</div>`
            }
            let savesScreenLevel = `<div class="saves-screen__level">
                                    <div class="saves-screen__level-icon" style="background: url(${levelsData[i].icon}) center center no-repeat; background-size: cover;"></div>
                                    <div class="saves-screen__level-data">
                                        <div class="saves-screen__level-data-texts">
                                            <div class="saves-screen__level-name">${levelsData[i].levelName}</div>
                                            ${gameType}
                                        </div>
                                        <div class="saves-screen__level-controls">
                                            <div class="saves-screen__level-control">
                                               <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" color="white" fill="none">
                                                    <path d="M2.5 12C2.5 7.52166 2.5 5.28249 3.89124 3.89124C5.28249 2.5 7.52166 2.5 12 2.5C16.4783 2.5 18.7175 2.5 20.1088 3.89124C21.5 5.28249 21.5 7.52166 21.5 12C21.5 16.4783 21.5 18.7175 20.1088 20.1088C18.7175 21.5 16.4783 21.5 12 21.5C7.52166 21.5 5.28249 21.5 3.89124 20.1088C2.5 18.7175 2.5 16.4783 2.5 12Z" stroke="currentColor" stroke-width="1.5" />
                                                    <circle cx="16.5" cy="7.5" r="1.5" stroke="currentColor" stroke-width="1.5" />
                                                    <path d="M16 22C15.3805 19.7749 13.9345 17.7821 11.8765 16.3342C9.65761 14.7729 6.87163 13.9466 4.01569 14.0027C3.67658 14.0019 3.33776 14.0127 3 14.0351" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                                    <path d="M13 18C14.7015 16.6733 16.5345 15.9928 18.3862 16.0001C19.4362 15.999 20.4812 16.2216 21.5 16.6617" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>`
            document.querySelector(".saves-screen__levels").insertAdjacentHTML("beforeend", savesScreenLevel)


        }

        let savesScreenLevelControls = document.querySelectorAll(".saves-screen__level-control")
        for (let i = 0; i < savesScreenLevelControls.length; i++) {
            try {
                savesScreenLevelControls[i].addEventListener("click", (e) => {
                    e.stopPropagation()
                    document.querySelector(".view-photo").classList.add("view-photo--active")
                    document.querySelector(".view-photo__window").style.background = `url(${levelsData[i].icon}) center center no-repeat`
                })
            } catch { }
        }

        document.querySelector(".view-photo").addEventListener("click", () => {
            document.querySelector(".view-photo").classList.remove("view-photo--active")
        })

        let levels = document.querySelectorAll(".saves-screen__level")
        for (let i = 0; i < levels.length; i++) {
            levels[i].addEventListener("click", (e) => {
                e.stopImmediatePropagation()
                for (let j = 0; j < levels.length; j++) {
                    levels[j].style.backgroundColor = "transparent"
                    levels[j].classList.remove("saves-screen__level--active")
                }
                levels[i].style.backgroundColor = "#6242a442"
                levels[i].classList.add("saves-screen__level--active")
                document.querySelector(".saves-screen__export-button").classList.remove("button--disabled")
                document.querySelector(".saves-screen__export-button").disabled = false
                selectedLevel.folderPath = levelsData[i].folderPath
            })
        }
    }

    function showNotification(title, description, audio) {
        audio.play()

        document.querySelector(".notification__title").textContent = title
        document.querySelector(".notification__description").textContent = description
        document.querySelector(".notification").classList.add("notification--active")
        setTimeout(() => {
            document.querySelector(".notification").classList.remove("notification--active")
        }, 5000)
    }

    if (navigator.onLine) {
        document.querySelector('#is-online').style.transform = "translateY(-30px)"

    } else {
        document.querySelector('#is-online').style.transform = "translateY(0)"
        document.querySelector('.play-screen__version-select-values-body').innerHTML = ''
        let versions = settings.installed_versions
        if (versions) {
            setVersions(versions)
        } else {
            document.querySelector(".play-screen__version-select-values-body").textContent = "No versions"
        }
    }


    window.api.levelsData((e, levelsD) => {
        levelsData = levelsD
        loadLevels(levelsData)
    })

    window.api.sendPath((e, data) => {
        if (data.for == "sendPathToMinecraft") {
            if (data.path[data.path.length - 1] == "\\") {
                document.querySelector(".settings-screen__minecraft-path-input").value = data.path + "minecraft"
                settings.minecraft_path = data.path + "minecraft"
            } else {
                document.querySelector(".settings-screen__minecraft-path-input").value = data.path + "\\minecraft"
                settings.minecraft_path = data.path + "\\minecraft"
            }
            window.api.settingsToCore('settingsToCore', settings)
            window.api.loadLevels('loadLevels', null)
        } 
        if (data.for == "sendPathToExport") {
            document.querySelector(".settings-screen__export-path-input").value = data.path
            settings.export_path = data.path
            window.api.settingsToCore('settingsToCore', settings)
        }   
    })

    window.addEventListener('offline', () => {
        document.querySelector("#is-online").style.backgroundColor = "#ff00005e"
        document.querySelector('#is-online').textContent = LANGUAGES[settings.language].is_offline_title
        document.querySelector('#is-online').style.transform = "translateY(0)"
        document.querySelector('.play-screen__version-select-values-body').innerHTML = ''
        setVersions(settings.installed_versions)
    })

    window.addEventListener('online', () => {
        document.querySelector('#is-online').style.backgroundColor = "#00800066"
        document.querySelector('#is-online').textContent = LANGUAGES[settings.language].is_online_title
        setTimeout(() => {
            document.querySelector('#is-online').style.transform = "translateY(-30px)"
        }, 3000)
        document.querySelector('.play-screen__version-select-values-body').innerHTML = ''
        getVersionsData().then((data) => {
            setVersions(data.versions)
        })
    })

    const nameInput = document.querySelector(".play-screen__name-input")
    nameInput.value = settings.username

    document.querySelector("#splash").textContent = SPLASHES[getRandomNumber(0, SPLASHES.length - 1)]
    document.querySelector(".settings-screen__minecraft-path-input").value = settings.minecraft_path
    document.querySelector(".settings-screen__export-path-input").value = settings.export_path
    document.querySelector(".settings-screen__language-select-current-value-text").textContent = getLanguage(settings.language)
    document.querySelector(".settings-screen__ram-select-current-value-text").textContent = settings.max_memory

    for (let i = 0; i < LANGUAGE_NAMES.length; i++) {
        const value = `<div class="select__value settings-screen__language-select-value" data-select-value="${LANGUAGE_NAMES[i][0]}">${LANGUAGE_NAMES[i][1]}</div>`
        document.querySelector(".settings-screen__language-select-values-body").insertAdjacentHTML("beforeend", value)
    }

    for (let i = 0; i < MAX_RAM_VALUES.length; i++) {
        const value = `<div class="select__value settings-screen__ram-select-value" data-select-value="${MAX_RAM_VALUES[i]}">${MAX_RAM_VALUES[i]}</div>`
        document.querySelector(".settings-screen__ram-select-values-body").insertAdjacentHTML("beforeend", value)
    }


    //loadLevels(levelsData)

    getVersionsData().then(data => {
        setVersions(data.versions)
    })


    /*function switchTab(tabSelector) {
        const tabs = document.querySelectorAll(".side-panel__element")
        const tabLines = document.querySelectorAll(".side-panel__tab .side-panel__tab-line")
        console.log(tabLines)
        for (let i = 0; i <= tabs.length; i++) {
            try {
                tabLines[i].style.display = 'none'
                tabs[i].style.backgroundColor = 'transparent'  
            } catch {}
        }
        document.querySelector(`${tabSelector} .side-panel__tab-line`).style.display = 'block' 
        
    }*/



    //LISTENERS

    document.addEventListener("click", () => {
        document.querySelector(".settings-screen__language-select-values-body").classList.remove("settings-screen__language-select-values-body--active")
        document.querySelector(".settings-screen__language-select-arrow").style.transform = 'rotate(90deg)'
        document.querySelector(".settings-screen__ram-select-values-body").classList.remove("settings-screen__ram-select-values-body--active")
        document.querySelector(".settings-screen__ram-select-arrow").style.transform = 'rotate(90deg)'

        document.querySelector(".play-screen__version-select").classList.remove("play-screen__version-select--active")
        document.querySelector(".play-screen__version-select-arrow").style.transform = 'rotate(90deg)'

        let savesScreenLevels = document.querySelectorAll(".saves-screen__level")
        for (let i = 0; i < savesScreenLevels.length; i++) {
            savesScreenLevels[i].style.backgroundColor = "transparent"
            savesScreenLevels[i].classList.remove("saves-screen__level--active")
        }

        document.querySelector(".saves-screen__export-button").classList.add("button--disabled")
        document.querySelector(".saves-screen__export-button").disabled = true
    })

    document.getElementById('play-button').addEventListener('click', () => {
        window.api.invoke('run-game')
    })

    document.querySelector("#leave-button").addEventListener("click", () => {
        console.log("leaving")
        window.api.leave('leave')
    })

    nameInput.addEventListener("change", () => {
        settings.username = nameInput.value
        window.api.settingsToCore('settingsToCore', settings)
    })

    document.querySelector(".play-screen__version-select").addEventListener('click', (e) => {
        e.stopImmediatePropagation()
        document.querySelector(".play-screen__version-select").classList.add("play-screen__version-select--active")
        document.querySelector(".play-screen__version-select-arrow").style.transform = 'rotate(270deg)'
    })

    const tabs = document.querySelectorAll(".side-panel__element")
    for (let i = 0; i <= tabs.length; i++) {
        try {
            tabs[i].addEventListener('click', (e) => {
                switchScreen('.' + e.currentTarget.getAttribute("data-to-screen"))
            })
        } catch { }
    }

    const languageSelectValues = document.querySelectorAll(".settings-screen__language-select-value")
    const languageSelectBody = document.querySelector(".settings-screen__language-select-values-body")
    const ramSelectValues = document.querySelectorAll(".settings-screen__ram-select-value")
    const ramSelectBody = document.querySelector(".settings-screen__ram-select-values-body")

    document.querySelector(".settings-screen__language-select").addEventListener('click', (e) => {
        e.stopPropagation()
        languageSelectBody.classList.add("settings-screen__language-select-values-body--active")
        document.querySelector(".settings-screen__language-select-arrow").style.transform = 'rotate(270deg)'
    })


    document.querySelector(".settings-screen__ram-select").addEventListener('click', (e) => {
        e.stopPropagation()
        ramSelectBody.classList.add("settings-screen__ram-select-values-body--active")
        document.querySelector(".settings-screen__ram-select-arrow").style.transform = 'rotate(270deg)'
    })


    for (let i = 0; i < languageSelectValues.length; i++) {
        try {
            languageSelectValues[i].addEventListener("click", (e) => {
                e.stopPropagation()
                document.querySelector(".settings-screen__language-select-current-value-text").textContent = languageSelectValues[i].textContent
                settings.language = languageSelectValues[i].getAttribute("data-select-value")
                switchLanguage()
                window.api.settingsToCore('settingsToCore', settings)
                languageSelectBody.classList.remove("settings-screen__language-select-values-body--active")
                document.querySelector(".settings-screen__language-select-arrow").style.transform = 'rotate(90deg)'
            })
        } catch { }
    }


    for (let i = 0; i < ramSelectValues.length; i++) {
        try {
            ramSelectValues[i].addEventListener("click", (e) => {
                e.stopPropagation()
                document.querySelector(".settings-screen__ram-select-current-value-text").textContent = ramSelectValues[i].textContent
                settings.max_memory = ramSelectValues[i].getAttribute("data-select-value")
                window.api.settingsToCore('settingsToCore', settings)
                ramSelectBody.classList.remove("settings-screen__ram-select-values-body--active")
                document.querySelector(".settings-screen__ram-select-arrow").style.transform = 'rotate(90deg)'
            })
        } catch { }
    }



    document.querySelector(".settings-screen__minecraft-path-button").addEventListener("click", () => {
        window.api.openPathDialog('openPathDialog', "sendPathToMinecraft")
    })

    document.querySelector(".settings-screen__export-path-button").addEventListener("click", () => {
        window.api.openPathDialog('openPathDialog', "sendPathToExport")
    })

    document.querySelector(".settings-screen__minecraft-path-input").addEventListener("change", () => {
        document.querySelector(".settings-screen__minecraft-path-input").value = document.querySelector(".settings-screen__minecraft-path-input").value + "\\minecraft"
        settings.minecraft_path = document.querySelector(".settings-screen__minecraft-path-input").value
        window.api.settingsToCore('settingsToCore', settings)
    })

    const launchProgress = document.querySelector(".launch-progress")
    const launchProgressBarDiv = document.querySelector(".launch-progress__bar div")
    const launchProgressTarget = document.querySelector(".launch-progress__target")

    launchProgressTarget.textContent = 'minecraft'


    window.api.loadingProgressEvent((e, data) => {
        launchProgress.style.display = 'block'
        let persent = (100 * data.current) / data.total
        launchProgressBarDiv.style.width = persent + "%"
        launchProgressTarget.textContent = data.name
        document.querySelector(".bottom-panel").style.display = "none"
    })


    window.api.launchingProgressEvent((e, data) => {
        if (data.task == data.total) {
            launchProgressBarDiv.style.width = "0%"
            launchProgress.style.display = 'none'
            document.querySelector(".bottom-panel").style.display = "flex"

            let hasIntalledVersion = false
            for (let i = 0; i < settings.installed_versions.length; i++) {
                if (settings.installed_versions[i].id == settings.minecraft_version) {
                    hasIntalledVersion = true
                }
            }
            if (!hasIntalledVersion) {
                settings.installed_versions = [...settings.installed_versions, {
                    id: settings.minecraft_version,
                    type: settings.minecraft_version_type,
                }]
                console.log("Set version: ", hasIntalledVersion, settings)
                window.api.settingsToCore('settingsToCore', settings)
            }

            console.log("tasks stop")
            return
        }
        launchProgress.style.display = 'block'
        document.querySelector(".bottom-panel").style.display = "none"
        let persent = (100 * data.task) / data.total
        launchProgressBarDiv.style.width = persent + "%"
        launchProgressTarget.textContent = 'Assets, Forge, Natives, Classes'
    })




    document.querySelector(".saves-screen__import-button").addEventListener("click", () => {

        window.api.importLevel('importLevel', settings.minecraft_path + "\\saves")
        window.api.importLevelEvent((e, data) => {
            if (data.isSuccess) {
                showNotification(
                    LANGUAGES[settings.language].notification_success_import_title,
                    LANGUAGES[settings.language].notification_success_import_description,
                    notificationAudio
                )
            } else if (data.errorCode === "NOT-VALID-FILE-EXTENSION") {
                showNotification(
                    LANGUAGES[settings.language].notification_not_valid_extension_title,
                    LANGUAGES[settings.language].notification_not_valid_extension_description,
                    notificationAudio
                )
            }
        })
    })

    

    document.querySelector(".saves-screen__export-button").addEventListener("click", () => {
        window.api.exportLevel('exportLevel', selectedLevel.folderPath)
        window.api.exportLevelEvent((e, data) => {
            if (data.isSuccess) {
                showNotification(
                    LANGUAGES[settings.language].notification_success_export_title,
                    languageValueParser(["LpathL"], [settings.export_path], LANGUAGES[settings.language].notification_success_export_description),
                    notificationAudio
                )
            }
        })
    })
    switchLanguage()

}


let settings = {}
let levelsData = []
window.api.settingsToUi((e, sett) => {
    settings = sett
    program()
})