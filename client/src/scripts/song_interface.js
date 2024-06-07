import { useContext } from "react";
import { axiosInstance } from "../context/backend_data_context";
import server_paths from "./server_paths";

export const null_current_select = {
    identifier: null, // Идентификатор песни.
    meta: null, // META этой песни.
    cover: null, // Ссылка на поучение фала обложки.
    song: null, // Ссылка на получение файла песни.
    is_playing: null, // Песня ирает?
    current_time: null, // Текущее место пригрывания.
    duration: null, // Полная продолжительность песни.
}

class SongInterface {
    constructor() {
        // Текущая выбранная музыка.
        this.current_select = null_current_select;
        this.audio_player_ref = null;
        this.song_track_ref = null;
    }

    // В плеере теряется this, так что приходиться передавать его тут.
    play(this_fake) {
        this_fake.current_select.is_playing = true;

        // Синхронизация всех кнопок проигрывания (относящихся к этой песне).
        window.document.querySelectorAll(".id_" + this_fake.current_select.identifier).forEach((element) => {
            // element.
        });

        return true;
    }

    pause(this_fake) {
        this_fake.current_select.is_playing = false;

        // Синхронизация всех кнопок проигрывания (относящихся к этой песне).
        window.document.querySelectorAll(".id_" + this_fake.current_select.identifier).forEach((element) => {
            // element.
        });

        return false;
    }

    async select(song_identifier) {
        localStorage.setItem("song_select", song_identifier);
        
        if (!this) {
            console.log("'this' потерян :(");
            return this.current_select;
        }

        // Мы хотим проиграть другую песню?
        if (this.current_select.identifier !== song_identifier) {
            this.current_select.identifier = song_identifier;
            const meta_response = await axiosInstance.get(server_paths.get_song_meta + song_identifier);
            this.current_select.meta = meta_response.data.data;
            if (this.current_select.meta.cover_file_name === null) {
                this.current_select.cover = this.get_random_default_cover();
            } else {
                this.current_select.cover = server_paths.get_cover_file_by_it_name + this.current_select.meta.cover_file_name.name;
            }
            this.current_select.song = server_paths.get_song_file_by_it_name + this.current_select.meta.song_file_name.name;
        }

        return this.current_select;
    }

    // // Каждый эвент проигрывания песни. (где-то 5 раз за секунду)
    // progress(current_time_sec, duration_sec) {
    //     this.current_select.current_time = current_time_sec;
    //     this.current_select.duration = duration_sec;
    // }

    async get_meta(song_identifier) {
        return await axiosInstance.get(server_paths.get_song_meta + song_identifier);
    }

    get_random_default_cover() {
        let random_number = String(Math.floor(Math.random() * 20));
        if (random_number.length === 1) {
            random_number = "0" + random_number;
        }
        return "./imgs/default_covers/tile0" + random_number + ".png";
    }

    async upload_song(meta, song_input, cover_input) {
        // Инициализация файла обложки.
        let cover_data = undefined;

        if (cover_input.files.length > 0) {
            cover_data = new FormData();
            cover_data.append('file', cover_input.files[0]);
        }

        // Инициализация файла песни.
        let song_data = undefined;

        if (song_input.files.length > 0) {
            song_data = new FormData();
            song_data.append('file', song_input.files[0]);
        }

        //
        const meta_request = await axiosInstance.post(server_paths.meta_upload, meta);
        const meta_status = await meta_request.data;

        if (!meta_status.is_success) {
            return meta_status;
        } else {
            let cover_status;
            if (cover_data) {
                const cover_request = await axiosInstance.post(server_paths.cover_upload, cover_data, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                });
                cover_status = await cover_request.data;
                if (!cover_status.is_success) {
                    return cover_status;
                }
            }

            const song_request = await axiosInstance.post(server_paths.song_upload, song_data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            const song_status = await song_request.data;
            if (!song_status.is_success) {
                return song_status;
            }

            return {is_success: true, data: ""};
        }
    }

    async download(meta) {
        let link = document.createElement('a');

        const response = await axiosInstance.get(server_paths.get_song_file_by_it_name + meta.song_file_name.name, {
            responseType: "blob",
        });

        const blob = response.data;
        const url = URL.createObjectURL(blob);
        link.href = url;
        link.setAttribute('download', meta.origin_name);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

const song_interface = new SongInterface();

export default song_interface;