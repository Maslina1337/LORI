import fs from "fs";
import path from "path";
import { PlaylistPersonal, Accessibility as PlaylistAccessibility, playlist_manager } from "./playlist_manager";
import { login_sockets } from "./login_sockets";
import { login_sockets_dates } from "./login_sockets_dates";

import read_files_sync from "../mechanism_exports/read_files_sync";

import { login_valid_check } from "../mechanism_exports/login_valid_check";
import { password_valid_check } from "../mechanism_exports/password_valid_check";
import { nickname_valid_check } from "../mechanism_exports/nickname_valid_check";
import { about_valid_check } from "../mechanism_exports/about_valid_check";

import { Playlist } from "./playlist_manager";
import { public_server_values } from "./public_server_values";

interface Account {
    login: string,
    password: string,
    about: string,
    avatar: string,
    nickname: string,
    personal_playlist: PlaylistPersonal,
    playlists: Array<Playlist>,

    login_changes_left: number;
}

interface AccountPublic {
    login: string,
    about: string,
    avatar: string,
    nickname: string,
    personal_playlist: PlaylistPersonal | null,
}

class accountManager {
    accounts: Array<Account>;

    constructor() {
        this.accounts = [];
        read_files_sync(path.join(__dirname, "./account_library")).forEach((file, index) => {
            this.accounts.push(JSON.parse(String(fs.readFileSync(file.filepath))));
        })

        console.log("ACCOUNTS: ", this.accounts);

        playlist_manager.init_personal_playlist_library(this.accounts);

        const logins = this.get_all_logins();
        login_sockets.addLogins(logins);
        login_sockets_dates.addLogins(logins);
    }

    get_all_logins(): Array<string> {
        let logins:Array<string> = [];
        this.accounts.forEach((account) => {
            logins.push(account.login);
        });
        return logins;
    }

    find_account(login: string): Account | null {
        let find: Account | null = null;

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

    find_account_index(login: string): number | null {
        let find: number | null = null;
        this.accounts.forEach((account, index) => {
            if (account.login === login) {
                find = index;
            }
        });
        return find;
    }

    add_account(login: string, password: string, about?: string, elo?: number, avatar?: string, nickname?: string): {is_success: boolean, data: string} {
        if (!login || !password) {
            return {is_success: false, data: "Не достаточно информации."};
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
                accessibility: PlaylistAccessibility.private,
            }
        });

        this.save_data_to_file(login);

        //Добовление в сокеты
        login_sockets.addLogin(login);
        login_sockets_dates.addLogin(login);

        return {is_success: true, data: "Аккаунт создан."};
    }

    get_private_account_data(login: string, password: string):Account | null {
        if (!login || !password) {
            return null;
        }
        let account_data = this.find_account(login);
        if (account_data) {
            if (account_data.password === password) {
                return account_data;
            } else {
                return null;
            }
        } else {
            return null;
        }
    }

    get_public_account_data(login: string): AccountPublic | null {
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
                personal_playlist: (account_data.personal_playlist.accessibility !== PlaylistAccessibility.private ? account_data.personal_playlist : null),
            };
        } else {
            return null;
        }
    }

    simple_update_account(original_login: string, nickname?: string, login?: string, password?: string, about?: string): {is_success: boolean, data: string} { 
        // Тесты валидности
        const valid_status = this.account_data_valid_check(login, password, nickname, about);
        if (!valid_status.is_valid) {
            return {is_success: false, data: valid_status.message}
        }
        const index = this.find_account_index(original_login);
        if (index !== null) {
            if (login) {
                // Если новый логин совпадает со старым это не считается за обновление.
                if (login !== original_login) {
                    if (this.accounts[index].login_changes_left > 0) {
                        this.accounts[index].login_changes_left--
                        this.global_login_change(index, original_login, login);
                    } else {
                        return {is_success: false, data: "У аккаунта не осталось возможностей изменить логин."};
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
            } else {
                this.save_data_to_file(original_login);
            }
            return {is_success: true, data: "Данные аккаунта обновлены."};
        } else {
            return {is_success: false, data: "Я не смог найти аккаунт."};
        }
    }

    simple_update_avatar(original_login: string, avatar: any): {is_success: boolean, data: string} {
        const index = this.find_account_index(original_login);
        if (index !== null) {
            let extname = path.extname(avatar.name);
            let is_extname_valid = false;

            for (let i = 0; i < public_server_values.valid_avatar_extnames.length; i++) {
                if (public_server_values.valid_avatar_extnames[i] === extname) {
                    is_extname_valid = true;
                    break;
                }
            }

            if (!is_extname_valid) {
                return {is_success: false, data: "Неразрешенное расширение."};
            }

            let new_avatar_name = Date.now() + extname;

            if (avatar) {
                avatar.mv(path.join(__dirname, "./account_avatar_library/", new_avatar_name))
            }

            // Удаление старого аватара.
            if (this.accounts[index].avatar !== "") {
                fs.unlink(path.join(__dirname, "./account_avatar_library/", this.accounts[index].avatar), (err) => {
                    if (err) {
                        console.error(err);
                    }
                });
            }

            this.accounts[index].avatar = new_avatar_name;
            
            this.save_data_to_file(original_login);
            
            return {is_success: true, data: "Аватар аккаунта обновлен."};
        } else {
            return {is_success: false, data: "Я не смог найти аккаунт."};
        }
    }

    save_data_to_file(login: string): {is_success: boolean, data: string} {
        const index = this.find_account_index(login);
        if (index !== null) {
            fs.writeFileSync(path.join(__dirname, "./account_library" ,`${login}.json`), JSON.stringify(this.accounts[index]));
            return {is_success: true, data: "Данные сохранены."};
        } else {
            return {is_success: false, data: "Аккаунт не найден."};
        }
    }

    rename_data_file(old_login: string, new_login: string): {is_success: boolean, data: string} {
        fs.renameSync(path.join(__dirname, "./account_library" ,`${old_login}.json`), path.join(__dirname, "./account_library" ,`${new_login}.json`));
        return {is_success: true, data: "Данные сохранены."};
    }

    delete_data_file(login: string): {is_success: boolean, data: string} {
        const index = this.find_account_index(login);
        if (index) {
            fs.unlinkSync(path.join(__dirname, "./account_library" ,`${login}.json`));
            return {is_success: true, data: "Данные стерты."};
        } else {
            return {is_success: false, data: "Аккаунт не найден."};
        }
    }
    
    // -------------------------------------------------------- Приватный функционал --------------------------------------------------------------------------------------------------------------------------

    private global_login_change(account_index: number, original_login: string, new_login: string): boolean {
        let is_success = true;
    
        // Код здесь заменяет все упоминания original_login на new_login.
    
        // Замена данных самого аккаунта.
        if (this.accounts[account_index].login === original_login) {
            this.accounts[account_index].login = new_login;
        } else {
            is_success = false;
        }
    
        return is_success;
    }

    private account_data_valid_check(login?: string, password?: string, nickname?: string, about?: string): {is_valid: boolean, message: string} {
        // Тесты валидности

        if (login) {
            if (!login_valid_check(login).is_valid) {
                return login_valid_check(login);
            }
        }

        if (password) {
            if (!password_valid_check(password).is_valid) {
                return password_valid_check(password);
            }
        }

        if (nickname) {
            if (!nickname_valid_check(nickname).is_valid) {
                return nickname_valid_check(nickname);
            }
        }

        if (about) {
            if (!about_valid_check(about).is_valid) {
                return about_valid_check(about);
            }
        }

        return {
            is_valid: true,
            message: "(●'◡'●)",
        }
    }
}

const account_manager = new accountManager();

export { account_manager, Account, AccountPublic };