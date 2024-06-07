"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Accessibility = exports.playlist_manager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const account_manager_1 = require("./account_manager");
const read_files_sync_1 = __importDefault(require("../mechanism_exports/read_files_sync"));
var Accessibility;
(function (Accessibility) {
    Accessibility[Accessibility["private"] = 0] = "private";
    Accessibility[Accessibility["public"] = 1] = "public";
})(Accessibility || (exports.Accessibility = Accessibility = {}));
;
class PlaylistManager {
    constructor() {
        this.playlist_library = [];
        (0, read_files_sync_1.default)(path_1.default.join(__dirname, "./account_library")).forEach((file, index) => {
            this.playlist_library.push(JSON.parse(String(fs_1.default.readFileSync(file.filepath))));
        });
        this.personal_playlist_library = {};
    }
    init_personal_playlist_library(accounts) {
        accounts.forEach((account, index) => {
            this.personal_playlist_library[account.login] = account.personal_playlist;
        });
    }
    create_playlist(login, draft) {
        // Пытаемся сгенерировать уникальное имя.
        let playlist_file_unique_name = String(Date.now());
        // Удоставеряемся в том, что такого имени нет больше ни у одного файла, потому что на этих именах всё и крутится.
        for (let some_value = 0; this.get_index(playlist_file_unique_name).is_found; some_value++) {
            if (some_value === 0) {
                playlist_file_unique_name += "_" + some_value;
            }
            else {
                playlist_file_unique_name.slice(playlist_file_unique_name.length - 2 - String(some_value).length, playlist_file_unique_name.length - 1);
                playlist_file_unique_name += "_" + some_value;
            }
        }
        const new_playlist = {
            name: draft.name,
            description: draft.description,
            creator: login,
            date_of_creating: new Date(),
            song_identifiers: draft.song_identifiers,
            accessibility: draft.accessibility,
            identifier: playlist_file_unique_name,
            subscribers: [login],
        };
        this.playlist_library.push(new_playlist);
        return { is_success: true, data: "Плейлист создан." };
    }
    get_playlists_indexes_by_creator(creator) {
        let suitable_playlists = [];
        this.playlist_library.forEach((playlist, index) => {
            if (playlist.creator === creator) {
                suitable_playlists.push(index);
            }
        });
        return suitable_playlists;
    }
    add_personal_song(login, song_identifier) {
        this.personal_playlist_library[login].song_identifiers.push(song_identifier);
        account_manager_1.account_manager.save_data_to_file(login);
    }
    add_song(login, song_identifier, playlist_identifier) {
        const account_find = account_manager_1.account_manager.find_account(login);
        if (account_find) {
            const playlist_index = this.get_index(playlist_identifier);
            if (playlist_index.is_found) {
                if (this.playlist_library[playlist_index.index].creator === login) {
                    this.playlist_library[playlist_index.index].song_identifiers.push(song_identifier);
                    return { is_success: true, data: "Композиция добавлена." };
                }
                else {
                    return { is_success: false, data: "Вы не являетесь создателем этой композиции." };
                }
            }
            else {
                return { is_success: false, data: "Плейлист не найден." };
            }
        }
        else {
            return { is_success: false, data: "Аккаунт не найден." };
        }
    }
    get_index(playlist_identifier) {
        let answer = {
            is_found: false,
            index: -1,
        };
        this.playlist_library.forEach((element, index) => {
            if (element.identifier === playlist_identifier) {
                answer.is_found = true;
                answer.index = index;
            }
        });
        return answer;
    }
    get_playlist(playlist_identifier) {
        let playlist = null;
        const index = this.get_index(playlist_identifier);
        if (index.is_found) {
            playlist = this.playlist_library[index.index];
        }
        return playlist;
    }
    save_playlist_to_file(playlist_identifier) {
        const find = this.get_index(playlist_identifier);
        if (find.is_found) {
            fs_1.default.writeFileSync(path_1.default.join(__dirname, "./playlist_library", `${playlist_identifier}.json`), JSON.stringify(this.playlist_library[find.index]));
            return { is_success: true, data: "Данные сохранены." };
        }
        else {
            return { is_success: false, data: "Плейлист не найден." };
        }
    }
    delete_data_file(playlist_identifier) {
        const find = this.get_index(playlist_identifier);
        if (find.is_found) {
            fs_1.default.unlinkSync(path_1.default.join(__dirname, "./playlist_library", `${playlist_identifier}.json`));
            return { is_success: true, data: "Данные стерты." };
        }
        else {
            return { is_success: false, data: "Плейлист не найден." };
        }
    }
}
const playlist_manager = new PlaylistManager();
exports.playlist_manager = playlist_manager;
