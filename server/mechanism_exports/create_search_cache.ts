// Этот скрипт призван запечь некоторые данные для быстрого поиска.
// Например, написав в поиске "И" нам не приходилось бы перебирать все возможные варианты,
// а просто обратиться к данным которые уже запечены.

import fs from "fs";
import path from "path";

// Буквы для которых будет производиться запекание.
import allowed_letters from "./search_cache_allowed_letter";

let cache: {[key: string]: any} = {};

export { cache }

interface NestedObject {
    current: Array<string>,
    next_letter: {[key: string]: NestedObject | Array<string>}
    past_letters: string;
}

export default function create_search_cache() {
    // === Жанры ===

    // Число букв до которых будет запекаться информация.
    const total_layers = 3;

    // Массив жанров.
    const genres: Array<string> = JSON.parse(String(fs.readFileSync(path.join(__dirname, "../data_management/genres.json"))));

    // Создание ключей.
    function create_keys(layers: number, past_letters: string): NestedObject | Array<string> {
        if (layers === 0) {
            return fill_key(past_letters);
        } else {
            let obj: NestedObject = {
                current: [],
                next_letter: {},
                past_letters: past_letters,
            };
    
            allowed_letters.forEach((letter) => {
                    // Создание ключей следующих букв.
                    obj.next_letter[letter] = create_keys(layers - 1, past_letters + letter);
                    obj.current = fill_key(obj.past_letters);
            })
            return obj;
        }
    }

    // Заполнение ключа жанрами.
    function fill_key(for_letters: string): Array<string> {
        let fill: Array<string> = [];

        // Незачем засовывать вообще все жанры сюда.
        if (for_letters.length === 0) {
            return fill;
        }

        genres.forEach((genre) => {
            if (genre.substring(0, for_letters.length) === for_letters) {
                fill.push(genre);
            }
        })

        fill.sort();
        
        return fill;
    }

    cache.genres = create_keys(total_layers, "");

    console.log(cache);
}