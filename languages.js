export const LANGUAGE_NAMES = [
    ["en_US", "English"],
    ["ru_RU", "Русский"],
    ["be_BY", "Беларуская"],
    ["uk_UA", "Українська"]

]

export const LANGUAGES = {
    en_US: {
        play_button: "Palay",
        is_offline_title: "No connection",
        is_online_title: "Connection restored",
        settings_ram: "Ram",
        settings_ram_description: "Allocate the maximum amount of RAM for the game",
        settings_language: "Launcher language",
        settings_language_description: "Set the UI language in the launcher",
        settings_minecraft_path: "Game Folder",
        settings_minecraft_path_description: "Specify the path to install the game",
        play_screen_name_input_label: "In-game name",
        play_screen_version_select_label: "Game version",
        launch_progress_label: "Loading",
        play_screen_version_input_loading: "Loading",
        leave_button: "Log out of the launcher",
        gametype_survival: "Survival", 
        gametype_creative: "Creative", 
        gametype_adventure: "Adventure", 
        gametype_spectator: "Spectator",
        gametype_hardcore: "Hardcore",
        saves_screen_no_levels_text: "There are no worlds yet. You will try changing the path to the game folder in the settings",
        notification_success_import_title: "Successful import",
        notification_success_import_description: "You've successfully imported a world",
    },
    ru_RU: {
        play_button: "Играть",
        is_offline_title: "Нет соединения",
        is_online_title: "Подключение восстановлено",
        settings_ram: "Оперативная память",
        settings_ram_description: "Выделите максимальное количество оперативной памяти для игры",
        settings_language: "Язык лаунчера",
        settings_language_description: "Установите язык пользовательского интерфейса в лаунчере",
        settings_minecraft_path: "Папка игры",
        settings_minecraft_path_description: "Укажите путь для установки игры",
        play_screen_name_input_label: "Имя в игре",
        play_screen_version_select_label: "Версия игры",
        launch_progress_label: "Загрузка",
        play_screen_version_input_loading: "Загрузка",
        leave_button: "Выйти из лаунчера",
        gametype_survival: "Выживание", 
        gametype_creative: "Творческий", 
        gametype_adventure: "Приключение", 
        gametype_spectator: "Наблюдатель",
        gametype_hardcore: "Хардкор",
        saves_screen_no_levels_text: "Миров пока нет. Вы попробуйте изменить путь к папке игры в настройках",
        notification_success_import_title: "Успешный импорт",
        notification_success_import_description: "Вы успешно импортировали мир",
    },
    be_BY: {
        play_button: "Гуляць",
        is_offline_title: "Няма злучэння",
        is_online_title: "Падключэнне адноўлена",
        settings_ram: "Аператыўная памяць",
        settings_ram_description: "Выдзеліце максімальную колькасць аператыўнай памяці для гульні.",
        settings_language: "Мова лаунчара",
        settings_language_description: "Усталюйце мову карыстальніцкага інтэрфейсу ў лаунчары",
        settings_minecraft_path: "Папка гульні",
        settings_minecraft_path_description: "Укажыце шлях для ўстаноўкі гульні",
        play_screen_name_input_label: "Імя ў гульні",
        play_screen_version_select_label: "Версія гульні",
        launch_progress_label: "Загрузка",
        play_screen_version_input_loading: "Загрузка",
        leave_button: "Выйсці з лаўчара",
        gametype_survival: "Выжывальніцтва", 
        gametype_creative: "Творчы", 
        gametype_adventure: "Прыгода", 
        gametype_spectator: "Назіральнік",
        gametype_hardcore: "Хардкор",
        saves_screen_no_levels_text: "Свету пакуль няма. Вы паспрабуйце змяніць шлях да папкі гульні ў наладах.",
        notification_success_import_title: "Успешны імпарт",
        notification_success_import_description: "Вы паспяхова імпартавалі свет",
    },
    uk_UA: {
        play_button: "Грати",
        is_offline_title: "Без зв'язку",
        is_online_title: "З'єднання відновлено",
        settings_ram: "Баран",
        settings_ram_description: "Виділіть максимальний обсяг оперативної пам'яті для гри",
        settings_language: "Мова лаунчера",
        settings_language_description: "Встановіть мову інтерфейсу користувача в панелі запуску",
        settings_minecraft_path: "Папка гульні",
        settings_minecraft_path_description: "Вкажіть шлях до встановлення гри",
        play_screen_name_input_label: "Назва в грі",
        play_screen_version_select_label: "Версія гри",
        launch_progress_label: "Завантаження",
        play_screen_version_input_loading: "Завантаження",
        leave_button: "Вихід з лаунчера",
        gametype_survival: "Виживання", 
        gametype_creative: "Творчість", 
        gametype_adventure: "Авантюра", 
        gametype_spectator: "Спостерігач",
        gametype_hardcore: "Хардкор",
        saves_screen_no_levels_text: "Світів поки що немає. Ви спробуєте змінити шлях до папки з грою в налаштуваннях",
        notification_success_import_title: "Вдалий імпорт",
        notification_success_import_description: "Ви успішно імпортували світ",
    },
}

export function getLanguage(id) {
    for (let i = 0; i < LANGUAGE_NAMES.length; i++) {
        if (LANGUAGE_NAMES[i][0] == id) {
            return LANGUAGE_NAMES[i][1]
        }
    } 
}



export function lang(language, selector) {
    return LANGUAGES[language][selector]
}


