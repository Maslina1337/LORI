"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.public_server_values = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const public_server_values = {
    // Параметры валидности.
    min_user_login_length: 5,
    max_user_login_length: 20,
    min_user_password_length: 8,
    max_user_password_length: 30,
    min_user_nickname_length: 5,
    max_user_nickname_length: 20,
    min_user_about_length: 0,
    max_user_about_length: 200,
    max_avatar_file_size: 4 * 1024 * 1024, // 4 MB вроде
    max_song_file_size: 20 * 1024 * 1024, // 20 MB вроде
    max_cover_file_size: 4 * 1024 * 1024, // 4 MB вроде
    min_song_name_length: 1,
    max_song_name_length: 50,
    // min_song_author_length: 0, // Пускай автор может быть неизвестен.
    max_song_author_length: 50,
    // min_song_album_length: 0, // Ненавижу обезательное заполнение альбома.
    max_song_album_length: 50,
    // Дефолтные настройки.
    default_side_player_display: true,
    default_song_volume: 100,
    default_life_page_content: "playlists",
    // Расширения.
    valid_song_extnames: [
        ".mp3", ".wav"
    ],
    valid_cover_extnames: [
        ".png", ".jpg", ".gif", ".jpeg"
    ],
    valid_avatar_extnames: [
        ".png", ".jpg", ".gif", ".jpeg"
    ],
    // Другое...
    random_about_placeholders: [
        "Привяу, хочешь анекдот?",
        "Кто я?",
        "Я думаю, что у тебя отличная прическа.",
        "А потом меня ещё спрашивают: \"Зачем тебе столько бетона?\"",
        "Звучит как-то не очень...",
        "Не нарушай мой покой.",
        "Я рад.",
    ],
    guest_name: "Незнакомец",
    guest_avatar_file: "/avatars/default_avatar.jpg",
    genres: JSON.parse(String(fs_1.default.readFileSync(path_1.default.join(__dirname, "../data_management/genres.json")))),
};
exports.public_server_values = public_server_values;
