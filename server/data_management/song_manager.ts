import fs from "fs";
import path from "path";
import { Account, account_manager } from "./account_manager";
import { song_meta_draft_valid_check } from "../mechanism_exports/song_meta_draft_valid_check";
import read_files_sync from "../mechanism_exports/read_files_sync";
import getAudioDurationInSeconds from "get-audio-duration";
import { public_server_values } from "./public_server_values";

const search_limitation = 100; // Максимальное кол-во результатов аоиска за запрос.
const number_of_names_song_has_in_search = 3;

interface SongMeta {
    names: Array<SongSelectionOfVariations>,
    origin_name: string,
    authors: Array<SongSelectionOfVariations>,
    origin_author: string,
    cover_file_name: FileName | null,
    albums: Array<SongSelectionOfVariations>,
    origin_album: string,
    genres: Array<SongSelectionOfVariations>,
    origin_genres: Array<string>,
    song_file_name: FileName,
    uploader_login: string,
    stats: SongStats,
    duration_seconds: number; 
    duration: string;
}

interface SongStats {
    number_of_complete_plays: number,
}

// Какие META данные мы должны получить при загрузке песни на сервер.
interface SongMetaInputs {
    name: string,
    author: string,
    album: string,
    genres: Array<string>,
}

interface FileName {
    extname: string,
    name: string, // Включая расширение.
    name_without_extname: string,
}

interface SongSelectionOfVariations {
    // Предложенный вариант.
    variation: string,
    // Текущий рейтинг варианта.
    logins_rating: Array<string>,
    // Логин предложившего этот вариант пользователя.
    suggested: string,
    // Дата предложения.
    creating_date: Date,
}

// interface SongName {
//     // Предложенное название.
//     name: string,
//     // Текущий рейтинг названия.
//     logins_rating: Array<string>,
//     // Логин предложившего это назавание пользователя.
//     suggested: string,
//     // Дата предложения.
//     creating_date: Date,
// }

// interface SongAuthor {
//     // Предложенный автор.
//     author: string,
//     // Текущий рейтинг автора.
//     logins_rating: Array<string>,
//     // Логин предложившего этого автора пользователя.
//     suggested: string,
//     // Дата предложения.
//     creating_date: Date,
// }

// interface SongAlbum {
//     // Предложенный альбом.
//     album: string,
//     // Текущий рейтинг альбома.
//     logins_rating: Array<string>,
//     // Логин предложившего этого автора пользователя.
//     suggested: string,
//     // Дата предложения.
//     creating_date: Date,
// }

// interface SongGenre {
//     // Предложенный жанр.
//     name: string,
//     // Текущий рейтинг жанра.
//     logins_rating: Array<string>,
//     // Логин предложившего этот жанр пользователя.
//     suggested: string,
//     // Дата предложения.
//     creating_date: Date,
// }

// Сколько жанров будет привязываться к логину
const genre_preferences_save = 3;

class SongManager {
    song_library: {[identifier: string]: SongMeta};

    // Черновики используются следующим образом: 
    // Пользователь отправляет черновик сведений о загружаемой им музыке,
    // и этот черновик привязывается к логину (получается логин может иметь только 1 черновик одновременно).
    // После того, как пользователь пришлет файл музыки, его черновик примениться именно к ней.
    song_meta_drafts: {[identifier: string]: SongMetaInputs | null};

    // Черновик для обложки. Отдельно от черновика сведений (meta), который выше.
    song_cover_drafts: {[identifier: string]: FileName | null};

    constructor() {
        this.song_library = {};
        read_files_sync(path.join(__dirname, "./song_meta_library")).forEach((file, index) => {
            this.song_library[file.name] = (JSON.parse(String(fs.readFileSync(file.filepath))));
        })

        this.song_meta_drafts = {};
        this.song_cover_drafts = {};

        let accounts = account_manager.accounts;
        accounts.forEach((account) => {
            this.song_meta_drafts[account.login] = null;
            this.song_cover_drafts[account.login] = null;
        });
    }

    upload_meta_draft(draft: SongMetaInputs, login: string): {is_success: boolean, data: string} {
        // Тесты валидности
        const valid_status = song_meta_draft_valid_check(draft);
        if (!valid_status.is_valid) {
            return {is_success: false, data: valid_status.message};
        }

        this.song_meta_drafts[login] = draft;

        return {is_success: true, data: "Свединья привязвны."};
    }

    upload_cover_draft(cover_file: any, login: string): {is_success: boolean, data: string} {
        if (!cover_file) {
            return {is_success: false, data: "Файл обложки не получен."};
        }

        let extname = path.extname(cover_file.name);
        let is_extname_valid = false;

        for (let i = 0; i < public_server_values.valid_cover_extnames.length; i++) {
            if (public_server_values.valid_cover_extnames[i] === extname) {
                is_extname_valid = true;
                break;
            }
        }

        if (!is_extname_valid) {
            return {is_success: false, data: "Неразрешенное расширение."};
        }

        // let stats = fs.statSync(cover_file)
        // let file_size_in_bytes = stats.size;
        // if (file_size_in_bytes > public_server_values.max_cover_file_size) {
        //     return {is_success: false, data: "Слишком размер обложки."};
        // }

        let cover_file_unique_name = String(Date.now());

        // Удоставеряемся в том, что такого имени нет больше ни у одного файла в черновике, потому что на этих именах всё и крутится.
        for (let some_value = 0; this.find_in_cover_drafts(cover_file_unique_name) !== null; some_value++) {
            if (some_value === 0) {
            cover_file_unique_name += "_" + some_value;
            } else {
                cover_file_unique_name.slice(cover_file_unique_name.length - 2 - String(some_value).length , cover_file_unique_name.length - 1);
                cover_file_unique_name += "_" + some_value;
            }
        }

        // Удаление старого файла обложки.
        let old_draft_cover_name = this.song_cover_drafts[login];
        if (old_draft_cover_name) {
            fs.unlinkSync(path.join(__dirname, "/song_draft_cover_library/", old_draft_cover_name.name));
        }

        this.song_cover_drafts[login] = {
            name: cover_file_unique_name + extname,
            extname: extname,
            name_without_extname: cover_file_unique_name,
        }

        cover_file_unique_name += extname;

        // Добавление нового файла обложки.
        cover_file.mv(path.join(__dirname, "./song_draft_cover_library/", cover_file_unique_name));

        return {is_success: true, data: "Обложка привязвна."};
    }

    async upload_song(file: any, login: string): Promise<{is_success: boolean, data: string}> {
        // Мы получили файл песни?
        if (!file) {
            return {is_success: false, data: "Файл музыки не получен."};
        }

        let extname = path.extname(file.name);
        let is_extname_valid = false;

        for (let i = 0; i < public_server_values.valid_song_extnames.length; i++) {
            if (public_server_values.valid_song_extnames[i] === extname) {
                is_extname_valid = true;
                break;
            }
        }

        // Расширение не валидно?
        if (!is_extname_valid) {
            return {is_success: false, data: "Неразрешенное расширение."};
        }

        // Пытаемся сгенерировать уникальное имя.
        let unique_identifier = String(Date.now());

        // Удоставеряемся в том, что такого имени нет больше ни у кого, потому что на этих именах всё и крутится.
        for (let some_value = 0; this.song_library[unique_identifier] !== undefined; some_value++) {
            if (some_value === 0) {
                unique_identifier += "_" + some_value;
            } else {
                unique_identifier.slice(unique_identifier.length - 2 - String(some_value).length , unique_identifier.length - 1);
                unique_identifier += "_" + some_value;
            }
        }

        // Проверяем заполнил ли пользователь данные о композиции.
        let song_meta = this.song_meta_drafts[login];
        if (!song_meta) {
            return {is_success: false, data: "Сначала вам нужно заполнить свединья о композиции."};
        }

        // Проверяем задал ли пользователь обложку для композиции.
        let cover = this.song_cover_drafts[login];
        if (cover) {
            // Перенос файла обложки в постоянное место жительство.
            // Задаём обложке то же имя, что и у META, и у самогО файла песни. Что бы у всех было одно и то же имя.
            fs.renameSync(path.join(__dirname, "./song_draft_cover_library/" + cover.name), path.join(__dirname, "./song_cover_library/" + unique_identifier + cover.extname));

            cover = {
                name: unique_identifier + cover.extname,
                extname: cover.extname,
                name_without_extname: unique_identifier,
            }
        } else {
            cover = null;
        }

        const song = {
            name: unique_identifier + extname,
            extname: extname,
            name_without_extname: unique_identifier
        }

        // Добавление файла композиции в директорию.
        file.mv(path.join(__dirname, "./song_library/", song.name));

        const duration_seconds = await getAudioDurationInSeconds(path.join(__dirname, "/song_library/", song.name));
        const duration = (duration_seconds > 3600 ? new Date(duration_seconds * 1000).toISOString().slice(11, 19) : 
        new Date(duration_seconds * 1000).toISOString().slice(14, 19));

        // Добавление META сведений о композиции.
        this.song_library[unique_identifier] = {
            names: [],
            origin_name: song_meta.name,
            authors: [],
            origin_author: song_meta.author,
            cover_file_name: cover,
            albums: [],
            origin_album: song_meta.album,
            genres: [],
            origin_genres: song_meta.genres,
            song_file_name: song,
            uploader_login: login,
            duration_seconds: duration_seconds,
            duration: duration,
            stats: {
                number_of_complete_plays: 0,
            }
        };

        // Сохранение META в файл.
        this.save_meta_to_file(unique_identifier);

        // Очистка черновиков.
        this.song_cover_drafts[login] = null;
        this.song_meta_drafts[login] = null;

        return {is_success: true, data: "Музыка добавлена."};
    }

    find_in_cover_drafts(name: string) {
        let find = null;
        const draft_array = Object.values(this.song_cover_drafts);
        for (let i = 0; i < draft_array.length; i++) {
            if (name === draft_array[i]?.name_without_extname) {
                find = i;
            }
        }
        return find;
    }

    save_meta_to_file(song_identifier: string): {is_success: boolean, data: string} {
        const song_meta = this.song_library[song_identifier];
        if (song_meta) {
            fs.writeFileSync(path.join(__dirname, "./song_meta_library" ,`${song_identifier}.json`), JSON.stringify(song_meta));
            return {is_success: true, data: "Данные сохранены."};
        } else {
            return {is_success: false, data: "Аккаунт не найден."};
        }
    }

    // // Поднять рейтинг какого нибудь имени из META песни.
    // name_up_rating(login: string, song_identifier: string, what_up: string): boolean {
    //     if (!this.song_library[song_identifier] || account_manager.find_account(login) === null || !what_up) {
    //         return false;
    //     }

    //     const names = this.song_library[song_identifier].names;

    //     for (let i = 0; i < names.length; i++) {
    //         const variation = names[i].variation;
    //         if (variation === what_up) {
    //             let is_able_to_rate = true;
    //             this.song_library[song_identifier].names[i].logins_rating.forEach((rated_login) => {
    //                 if (login === rated_login) {
    //                     is_able_to_rate = false;
    //                 }
    //             });
    //             if (is_able_to_rate) {
    //                 this.song_library[song_identifier].names[i].logins_rating.push(login);
    //                 this.save_meta_to_file(song_identifier);
    //                 return true;
    //             }
    //         }
    //     }
    //     return false;
    // }

    // add_complete_play(login: string, song_identifier: string) {
    //     // Добавить +1 к статистике прослушиваний данной песни.
    // }

    // search(value: string, custom_limitation: number) {
    //         let search_results: Array<string> = [];
    //         value = value.toLocaleLowerCase();

    //         let keys = Object.keys(this.song_library);

    //         if (search_limitation < custom_limitation) {
    //             const used_limitation = search_limitation;
    //         } else {
    //             const used_limitation = custom_limitation;
    //         }

    //         Object.keys(this.song_library).forEach((song_identifier) => {
    //             if (this.song_library[song_identifier].origin_name.includes(value)) {

    //             }
    //         })
    // }

    // get_account_preferences(account: Account) {
    //     let lovely_genres_percents = 
    //     account.playlists.forEach((playlist) => {
    //         playlist.song_identifiers.forEach((song_identifier) => {
    //             this.song_library[song_identifier].genres
    //         })
    //     })
    // }

    // get_recomendations(count_of_recomendations: number, login: string) {

    // }
}

const song_manager = new SongManager();

export { song_manager, SongMeta, SongSelectionOfVariations, SongMetaInputs, SongManager };