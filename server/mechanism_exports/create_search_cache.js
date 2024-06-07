"use strict";
// Этот скрипт призван запечь некоторые данные для быстрого поиска.
// Например, написав в поиске "И" нам не приходилось бы перебирать все возможные варианты,
// а просто обратиться к данным которые уже запечены.
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cache = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
// Буквы для которых будет производиться запекание.
const search_cache_allowed_letter_1 = __importDefault(require("./search_cache_allowed_letter"));
let cache = {};
exports.cache = cache;
function create_search_cache() {
    // === Жанры ===
    // Число букв до которых будет запекаться информация.
    const total_layers = 3;
    // Массив жанров.
    const genres = JSON.parse(String(fs_1.default.readFileSync(path_1.default.join(__dirname, "../data_management/genres.json"))));
    // Создание ключей.
    function create_keys(layers, past_letters) {
        if (layers === 0) {
            return fill_key(past_letters);
        }
        else {
            let obj = {
                current: [],
                next_letter: {},
                past_letters: past_letters,
            };
            search_cache_allowed_letter_1.default.forEach((letter) => {
                // Создание ключей следующих букв.
                obj.next_letter[letter] = create_keys(layers - 1, past_letters + letter);
                obj.current = fill_key(obj.past_letters);
            });
            return obj;
        }
    }
    // Заполнение ключа жанрами.
    function fill_key(for_letters) {
        let fill = [];
        // Незачем засовывать вообще все жанры сюда.
        if (for_letters.length === 0) {
            return fill;
        }
        genres.forEach((genre) => {
            if (genre.substring(0, for_letters.length) === for_letters) {
                fill.push(genre);
            }
        });
        fill.sort();
        return fill;
    }
    cache.genres = create_keys(total_layers, "");
    console.log(cache);
}
exports.default = create_search_cache;
