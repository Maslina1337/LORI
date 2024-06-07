import fs from "fs";
import path from "path";
import { Account, account_manager } from "./account_manager";
import read_files_sync from "../mechanism_exports/read_files_sync";

enum Accessibility {private, public};

interface Playlist {
    name: string,
    description: string,
    creator: string,
    date_of_creating: Date,
    song_identifiers: Array<string>,
    accessibility: Accessibility,
    identifier: string,
    subscribers: Array<string>
}

interface PlaylistPersonal {
    song_identifiers: Array<string>,
    accessibility: Accessibility,
}

interface PlaylistDraft {
    name: string,
    description: string,
    song_identifiers: Array<string>,
    accessibility: Accessibility,
}

class PlaylistManager {
    playlist_library: Array<Playlist>

    personal_playlist_library: {[key: string]: PlaylistPersonal}

    constructor() {
        this.playlist_library = [];
        read_files_sync(path.join(__dirname, "./account_library")).forEach((file, index) => {
            this.playlist_library.push(JSON.parse(String(fs.readFileSync(file.filepath))));
        })

        this.personal_playlist_library = {};
    }

    init_personal_playlist_library(accounts: Array<Account>) {
        accounts.forEach((account, index) => {
            this.personal_playlist_library[account.login] = account.personal_playlist;
        });
    }

    create_playlist(login: string, draft: PlaylistDraft): {is_success: boolean, data: string} {
        // Пытаемся сгенерировать уникальное имя.
        let playlist_file_unique_name = String(Date.now());

        // Удоставеряемся в том, что такого имени нет больше ни у одного файла, потому что на этих именах всё и крутится.
        for (let some_value = 0; this.get_index(playlist_file_unique_name).is_found; some_value++) {
            if (some_value === 0) {
                playlist_file_unique_name += "_" + some_value;
            } else {
                playlist_file_unique_name.slice(playlist_file_unique_name.length - 2 - String(some_value).length , playlist_file_unique_name.length - 1);
                playlist_file_unique_name += "_" + some_value;
            }
        }

        const new_playlist: Playlist = {
            name: draft.name,
            description: draft.description,
            creator: login,
            date_of_creating: new Date(),
            song_identifiers: draft.song_identifiers,
            accessibility: draft.accessibility,
            identifier: playlist_file_unique_name,
            subscribers: [login],
        }
        this.playlist_library.push(new_playlist);

        

        return {is_success: true, data: "Плейлист создан."};
    }

    get_playlists_indexes_by_creator(creator: string): Array<number> {
        let suitable_playlists: Array<number> = [];
        this.playlist_library.forEach((playlist, index) => {
            if (playlist.creator === creator) {
                suitable_playlists.push(index);
            }
        })
        return suitable_playlists;
    }

    add_personal_song(login: string, song_identifier: string) {
        this.personal_playlist_library[login].song_identifiers.push(song_identifier);
        account_manager.save_data_to_file(login);
    }

    add_song(login: string, song_identifier: string, playlist_identifier: string) {
        const account_find = account_manager.find_account(login);
        if (account_find) {
            const playlist_index = this.get_index(playlist_identifier);
            if (playlist_index.is_found) {
                if (this.playlist_library[playlist_index.index].creator === login) {
                    this.playlist_library[playlist_index.index].song_identifiers.push(song_identifier);
                    return {is_success: true, data: "Композиция добавлена."}
                } else {
                    return {is_success: false, data: "Вы не являетесь создателем этой композиции."}
                }
            } else {
                return {is_success: false, data: "Плейлист не найден."}
            }
        } else {
            return {is_success: false, data: "Аккаунт не найден."}
        }
    }

    get_index(playlist_identifier: string) {
        let answer = {
            is_found: false,
            index: -1,
        }
        this.playlist_library.forEach((element, index) => {
            if (element.identifier === playlist_identifier) {
                answer.is_found = true;
                answer.index = index;
            }
        })
        return answer;
    }

    get_playlist(playlist_identifier: string) {
        let playlist = null
        const index = this.get_index(playlist_identifier);
        if (index.is_found) {
            playlist = this.playlist_library[index.index];
        }
        return playlist;
    }


    save_playlist_to_file(playlist_identifier: string): {is_success: boolean, data: string} {
        const find = this.get_index(playlist_identifier);
        if (find.is_found) {
            fs.writeFileSync(path.join(__dirname, "./playlist_library" ,`${playlist_identifier}.json`), JSON.stringify(this.playlist_library[find.index]));
            return {is_success: true, data: "Данные сохранены."};
        } else {
            return {is_success: false, data: "Плейлист не найден."};
        }
    }

    delete_data_file(playlist_identifier: string): {is_success: boolean, data: string} {
        const find = this.get_index(playlist_identifier);
        if (find.is_found) {
            fs.unlinkSync(path.join(__dirname, "./playlist_library" ,`${playlist_identifier}.json`));
            return {is_success: true, data: "Данные стерты."};
        } else {
            return {is_success: false, data: "Плейлист не найден."};
        }
    }
}

const playlist_manager = new PlaylistManager();

export { playlist_manager, Playlist, PlaylistDraft, PlaylistPersonal, Accessibility}