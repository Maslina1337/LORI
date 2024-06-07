"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SongManager = exports.song_manager = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const account_manager_1 = require("./account_manager");
const song_meta_draft_valid_check_1 = require("../mechanism_exports/song_meta_draft_valid_check");
const read_files_sync_1 = __importDefault(require("../mechanism_exports/read_files_sync"));
const get_audio_duration_1 = __importDefault(require("get-audio-duration"));
const public_server_values_1 = require("./public_server_values");
const search_limitation = 100; // Максимальное кол-во результатов аоиска за запрос.
const number_of_names_song_has_in_search = 3;
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
    constructor() {
        this.song_library = {};
        (0, read_files_sync_1.default)(path_1.default.join(__dirname, "./song_meta_library")).forEach((file, index) => {
            this.song_library[file.name] = (JSON.parse(String(fs_1.default.readFileSync(file.filepath))));
        });
        this.song_meta_drafts = {};
        this.song_cover_drafts = {};
        let accounts = account_manager_1.account_manager.accounts;
        accounts.forEach((account) => {
            this.song_meta_drafts[account.login] = null;
            this.song_cover_drafts[account.login] = null;
        });
    }
    upload_meta_draft(draft, login) {
        // Тесты валидности
        const valid_status = (0, song_meta_draft_valid_check_1.song_meta_draft_valid_check)(draft);
        if (!valid_status.is_valid) {
            return { is_success: false, data: valid_status.message };
        }
        this.song_meta_drafts[login] = draft;
        return { is_success: true, data: "Свединья привязвны." };
    }
    upload_cover_draft(cover_file, login) {
        if (!cover_file) {
            return { is_success: false, data: "Файл обложки не получен." };
        }
        let extname = path_1.default.extname(cover_file.name);
        let is_extname_valid = false;
        for (let i = 0; i < public_server_values_1.public_server_values.valid_cover_extnames.length; i++) {
            if (public_server_values_1.public_server_values.valid_cover_extnames[i] === extname) {
                is_extname_valid = true;
                break;
            }
        }
        if (!is_extname_valid) {
            return { is_success: false, data: "Неразрешенное расширение." };
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
            }
            else {
                cover_file_unique_name.slice(cover_file_unique_name.length - 2 - String(some_value).length, cover_file_unique_name.length - 1);
                cover_file_unique_name += "_" + some_value;
            }
        }
        // Удаление старого файла обложки.
        let old_draft_cover_name = this.song_cover_drafts[login];
        if (old_draft_cover_name) {
            fs_1.default.unlinkSync(path_1.default.join(__dirname, "/song_draft_cover_library/", old_draft_cover_name.name));
        }
        this.song_cover_drafts[login] = {
            name: cover_file_unique_name + extname,
            extname: extname,
            name_without_extname: cover_file_unique_name,
        };
        cover_file_unique_name += extname;
        // Добавление нового файла обложки.
        cover_file.mv(path_1.default.join(__dirname, "./song_draft_cover_library/", cover_file_unique_name));
        return { is_success: true, data: "Обложка привязвна." };
    }
    upload_song(file, login) {
        return __awaiter(this, void 0, void 0, function* () {
            // Мы получили файл песни?
            if (!file) {
                return { is_success: false, data: "Файл музыки не получен." };
            }
            let extname = path_1.default.extname(file.name);
            let is_extname_valid = false;
            for (let i = 0; i < public_server_values_1.public_server_values.valid_song_extnames.length; i++) {
                if (public_server_values_1.public_server_values.valid_song_extnames[i] === extname) {
                    is_extname_valid = true;
                    break;
                }
            }
            // Расширение не валидно?
            if (!is_extname_valid) {
                return { is_success: false, data: "Неразрешенное расширение." };
            }
            // Пытаемся сгенерировать уникальное имя.
            let unique_identifier = String(Date.now());
            // Удоставеряемся в том, что такого имени нет больше ни у кого, потому что на этих именах всё и крутится.
            for (let some_value = 0; this.song_library[unique_identifier] !== undefined; some_value++) {
                if (some_value === 0) {
                    unique_identifier += "_" + some_value;
                }
                else {
                    unique_identifier.slice(unique_identifier.length - 2 - String(some_value).length, unique_identifier.length - 1);
                    unique_identifier += "_" + some_value;
                }
            }
            // Проверяем заполнил ли пользователь данные о композиции.
            let song_meta = this.song_meta_drafts[login];
            if (!song_meta) {
                return { is_success: false, data: "Сначала вам нужно заполнить свединья о композиции." };
            }
            // Проверяем задал ли пользователь обложку для композиции.
            let cover = this.song_cover_drafts[login];
            if (cover) {
                // Перенос файла обложки в постоянное место жительство.
                // Задаём обложке то же имя, что и у META, и у самогО файла песни. Что бы у всех было одно и то же имя.
                fs_1.default.renameSync(path_1.default.join(__dirname, "./song_draft_cover_library/" + cover.name), path_1.default.join(__dirname, "./song_cover_library/" + unique_identifier + cover.extname));
                cover = {
                    name: unique_identifier + cover.extname,
                    extname: cover.extname,
                    name_without_extname: unique_identifier,
                };
            }
            else {
                cover = null;
            }
            const song = {
                name: unique_identifier + extname,
                extname: extname,
                name_without_extname: unique_identifier
            };
            // Добавление файла композиции в директорию.
            file.mv(path_1.default.join(__dirname, "./song_library/", song.name));
            const duration_seconds = yield (0, get_audio_duration_1.default)(path_1.default.join(__dirname, "/song_library/", song.name));
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
            return { is_success: true, data: "Музыка добавлена." };
        });
    }
    find_in_cover_drafts(name) {
        var _a;
        let find = null;
        const draft_array = Object.values(this.song_cover_drafts);
        for (let i = 0; i < draft_array.length; i++) {
            if (name === ((_a = draft_array[i]) === null || _a === void 0 ? void 0 : _a.name_without_extname)) {
                find = i;
            }
        }
        return find;
    }
    save_meta_to_file(song_identifier) {
        const song_meta = this.song_library[song_identifier];
        if (song_meta) {
            fs_1.default.writeFileSync(path_1.default.join(__dirname, "./song_meta_library", `${song_identifier}.json`), JSON.stringify(song_meta));
            return { is_success: true, data: "Данные сохранены." };
        }
        else {
            return { is_success: false, data: "Аккаунт не найден." };
        }
    }
}
exports.SongManager = SongManager;
const song_manager = new SongManager();
exports.song_manager = song_manager;
