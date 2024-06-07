"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.account_manager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const playlist_manager_1 = require("./playlist_manager");
const login_sockets_1 = require("./login_sockets");
const login_sockets_dates_1 = require("./login_sockets_dates");
const read_files_sync_1 = __importDefault(require("../mechanism_exports/read_files_sync"));
const login_valid_check_1 = require("../mechanism_exports/login_valid_check");
const password_valid_check_1 = require("../mechanism_exports/password_valid_check");
const nickname_valid_check_1 = require("../mechanism_exports/nickname_valid_check");
const about_valid_check_1 = require("../mechanism_exports/about_valid_check");
const public_server_values_1 = require("./public_server_values");
class accountManager {
    constructor() {
        this.accounts = [];
        (0, read_files_sync_1.default)(path_1.default.join(__dirname, "./account_library")).forEach((file, index) => {
            this.accounts.push(JSON.parse(String(fs_1.default.readFileSync(file.filepath))));
        });
        console.log("ACCOUNTS: ", this.accounts);
        playlist_manager_1.playlist_manager.init_personal_playlist_library(this.accounts);
        const logins = this.get_all_logins();
        login_sockets_1.login_sockets.addLogins(logins);
        login_sockets_dates_1.login_sockets_dates.addLogins(logins);
    }
    get_all_logins() {
        let logins = [];
        this.accounts.forEach((account) => {
            logins.push(account.login);
        });
        return logins;
    }
    find_account(login) {
        let find = null;
        if (!login) {
            return find;
        }
        this.accounts.forEach(element => {
            if (element.login === login) {
                find = element;
            }
        });
        return find;
    }
    find_account_index(login) {
        let find = null;
        this.accounts.forEach((account, index) => {
            if (account.login === login) {
                find = index;
            }
        });
        return find;
    }
    add_account(login, password, about, elo, avatar, nickname) {
        if (!login || !password) {
            return { is_success: false, data: "Не достаточно информации." };
        }
        this.accounts.push({
            login: login,
            password: password,
            about: (about ? about : ""),
            avatar: (avatar ? avatar : ""),
            nickname: (nickname ? nickname : login),
            login_changes_left: 3,
            playlists: [],
            personal_playlist: {
                song_identifiers: [],
                accessibility: playlist_manager_1.Accessibility.private,
            }
        });
        this.save_data_to_file(login);
        //Добовление в сокеты
        login_sockets_1.login_sockets.addLogin(login);
        login_sockets_dates_1.login_sockets_dates.addLogin(login);
        return { is_success: true, data: "Аккаунт создан." };
    }
    get_private_account_data(login, password) {
        if (!login || !password) {
            return null;
        }
        let account_data = this.find_account(login);
        if (account_data) {
            if (account_data.password === password) {
                return account_data;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    get_public_account_data(login) {
        if (!login) {
            return null;
        }
        let account_data = this.find_account(login);
        if (account_data) {
            return {
                login: login,
                nickname: account_data.nickname,
                avatar: account_data.avatar,
                about: account_data.about,
                personal_playlist: (account_data.personal_playlist.accessibility !== playlist_manager_1.Accessibility.private ? account_data.personal_playlist : null),
            };
        }
        else {
            return null;
        }
    }
    simple_update_account(original_login, nickname, login, password, about) {
        // Тесты валидности
        const valid_status = this.account_data_valid_check(login, password, nickname, about);
        if (!valid_status.is_valid) {
            return { is_success: false, data: valid_status.message };
        }
        const index = this.find_account_index(original_login);
        if (index !== null) {
            if (login) {
                // Если новый логин совпадает со старым это не считается за обновление.
                if (login !== original_login) {
                    if (this.accounts[index].login_changes_left > 0) {
                        this.accounts[index].login_changes_left--;
                        this.global_login_change(index, original_login, login);
                    }
                    else {
                        return { is_success: false, data: "У аккаунта не осталось возможностей изменить логин." };
                    }
                }
            }
            if (nickname) {
                this.accounts[index].nickname = nickname;
            }
            if (password) {
                this.accounts[index].password = password;
            }
            if (about) {
                this.accounts[index].about = about;
            }
            if (login) {
                this.rename_data_file(original_login, login);
                this.save_data_to_file(login);
            }
            else {
                this.save_data_to_file(original_login);
            }
            return { is_success: true, data: "Данные аккаунта обновлены." };
        }
        else {
            return { is_success: false, data: "Я не смог найти аккаунт." };
        }
    }
    simple_update_avatar(original_login, avatar) {
        const index = this.find_account_index(original_login);
        if (index !== null) {
            let extname = path_1.default.extname(avatar.name);
            let is_extname_valid = false;
            for (let i = 0; i < public_server_values_1.public_server_values.valid_avatar_extnames.length; i++) {
                if (public_server_values_1.public_server_values.valid_avatar_extnames[i] === extname) {
                    is_extname_valid = true;
                    break;
                }
            }
            if (!is_extname_valid) {
                return { is_success: false, data: "Неразрешенное расширение." };
            }
            let new_avatar_name = Date.now() + extname;
            if (avatar) {
                avatar.mv(path_1.default.join(__dirname, "./account_avatar_library/", new_avatar_name));
            }
            // Удаление старого аватара.
            if (this.accounts[index].avatar !== "") {
                fs_1.default.unlink(path_1.default.join(__dirname, "./account_avatar_library/", this.accounts[index].avatar), (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }
            this.accounts[index].avatar = new_avatar_name;
            this.save_data_to_file(original_login);
            return { is_success: true, data: "Аватар аккаунта обновлен." };
        }
        else {
            return { is_success: false, data: "Я не смог найти аккаунт." };
        }
    }
    save_data_to_file(login) {
        const index = this.find_account_index(login);
        if (index !== null) {
            fs_1.default.writeFileSync(path_1.default.join(__dirname, "./account_library", `${login}.json`), JSON.stringify(this.accounts[index]));
            return { is_success: true, data: "Данные сохранены." };
        }
        else {
            return { is_success: false, data: "Аккаунт не найден." };
        }
    }
    rename_data_file(old_login, new_login) {
        fs_1.default.renameSync(path_1.default.join(__dirname, "./account_library", `${old_login}.json`), path_1.default.join(__dirname, "./account_library", `${new_login}.json`));
        return { is_success: true, data: "Данные сохранены." };
    }
    delete_data_file(login) {
        const index = this.find_account_index(login);
        if (index) {
            fs_1.default.unlinkSync(path_1.default.join(__dirname, "./account_library", `${login}.json`));
            return { is_success: true, data: "Данные стерты." };
        }
        else {
            return { is_success: false, data: "Аккаунт не найден." };
        }
    }
    // -------------------------------------------------------- Приватный функционал --------------------------------------------------------------------------------------------------------------------------
    global_login_change(account_index, original_login, new_login) {
        let is_success = true;
        // Код здесь заменяет все упоминания original_login на new_login.
        // Замена данных самого аккаунта.
        if (this.accounts[account_index].login === original_login) {
            this.accounts[account_index].login = new_login;
        }
        else {
            is_success = false;
        }
        return is_success;
    }
    account_data_valid_check(login, password, nickname, about) {
        // Тесты валидности
        if (login) {
            if (!(0, login_valid_check_1.login_valid_check)(login).is_valid) {
                return (0, login_valid_check_1.login_valid_check)(login);
            }
        }
        if (password) {
            if (!(0, password_valid_check_1.password_valid_check)(password).is_valid) {
                return (0, password_valid_check_1.password_valid_check)(password);
            }
        }
        if (nickname) {
            if (!(0, nickname_valid_check_1.nickname_valid_check)(nickname).is_valid) {
                return (0, nickname_valid_check_1.nickname_valid_check)(nickname);
            }
        }
        if (about) {
            if (!(0, about_valid_check_1.about_valid_check)(about).is_valid) {
                return (0, about_valid_check_1.about_valid_check)(about);
            }
        }
        return {
            is_valid: true,
            message: "(●'◡'●)",
        };
    }
}
const account_manager = new accountManager();
exports.account_manager = account_manager;
