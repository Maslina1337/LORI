import { SongMetaInputs } from "../data_management/song_manager";
import { public_server_values } from "../data_management/public_server_values";

function song_meta_draft_valid_check(draft: SongMetaInputs): { is_valid: boolean, message: string } {
    // Название - это единственное обязательное поле.
    if (!draft.name) {
        return { is_valid: false, message: `Название - это единственное обязательное поле. Давай заполняй.`}
    }

    // Название
    if (draft.name.length < public_server_values.min_song_name_length) {
        return { is_valid: false, message: `Название композиции слишком короткое. Мининум ${public_server_values.min_song_name_length} символов.` };
    }
    if (draft.name.length > public_server_values.max_song_name_length) {
        return { is_valid: false, message: `Название композиции слишком длинное. Максимум ${public_server_values.max_song_name_length} символов.` };
    }

    // Автор
    // if (draft.author.length < public_server_values.min_song_author_length) {
    //     return { is_valid: false, message: `Имя автора слишком короткое. Мининум ${public_server_values.min_song_author_length} символов.` };
    // }
    if (draft.author.length > public_server_values.max_song_author_length) {
        return { is_valid: false, message: `Имя автора слишком длинное. Максимум ${public_server_values.max_song_author_length} символов.` };
    }

    // Альбом
    // if (draft.album.length < public_server_values.min_song_album_length) {
    //     return { is_valid: false, message: `Название альбома слишком короткое. Мининум ${public_server_values.min_song_album_length} символов.` };
    // }
    if (draft.album.length > public_server_values.max_song_album_length) {
        return { is_valid: false, message: `Название альбома слишком длинное. Максимум ${public_server_values.max_song_album_length} символов.` };
    }

    // Жанры
    if (draft.genres) {
        let is_genres_valid = true;
        draft.genres.forEach((draft_genre) => {
            let is_current_genre_valid = false;
            public_server_values.genres.forEach((valid_genre) => {
                if (draft_genre === valid_genre) {
                    is_current_genre_valid = true;
                }
            });
            if (!is_current_genre_valid) {
                is_genres_valid = false;
            }
        })
    
        if (!is_genres_valid) {
            return { is_valid: false, message: `Я не признаю такие жанры.` };
        }
    }

    // Всё валидно.
    return { is_valid: true, message: "Данные прошли тест на валидность." };
}

export { song_meta_draft_valid_check };