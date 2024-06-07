import { useContext, useEffect, useRef, useState } from "react";
import song_interface from "../../scripts/song_interface";
import ButtonInconstancy from "./button_inconstancy";
import CheckInconstancy from "./check_inconstancy";
import "./song_row.css";
import { axiosInstance } from "../../context/backend_data_context";
import server_paths from "../../scripts/server_paths";
import { SongCurrentSelectContext } from "../../context/song_current_select_context";
import { SongCurrentTimeContext } from "../../context/song_current_time_context";

export default function SongRow({ song_identifier }) {
    const song_row_ref = useRef();
    const progress_ref = useRef();

    const { set_is_playing, set_identifier, set_cover, set_song, set_meta } = useContext(SongCurrentSelectContext);

    const { current_time, duration } = useContext(SongCurrentTimeContext);

    const [this_song_row_meta, set_this_song_row_meta] = useState(null);

    const [random_cover, set_random_cover] = useState(song_interface.get_random_default_cover());

    useEffect(() => {
        async function init() {
            const response_meta = await song_interface.get_meta(song_identifier);
            if (response_meta.data.is_success) {
                set_this_song_row_meta(response_meta.data.data);
            }
        }
        init();
    }, [])

    async function select() {
        const new_select = await song_interface.select(song_identifier);

        set_cover(new_select.cover);
        set_meta(new_select.meta);
        set_identifier(new_select.identifier);
        set_song(new_select.song);
    }

    function play() {
        select();
        debugger;
        set_is_playing(song_interface.play(song_interface));
    }

    function pause() {
        set_is_playing(song_interface.pause(song_interface));
    }

    function progress(current_time, duration) {
        if (song_interface.current_select.identifier === song_identifier) {
            if (progress_ref && progress_ref.current && current_time && duration) {
                progress_ref.current.style.maxWidth = (current_time / duration * 100) + "%"
            }
        } else {
            if (progress_ref && progress_ref.current) {
                progress_ref.current.style.maxWidth = "0%"
            }
        }
    }

    function download() {
        song_interface.download(this_song_row_meta);
    }

    useEffect(() => {
        progress(current_time, duration);
    }, [current_time])

    if (song_identifier && this_song_row_meta) {
        return (
            <div className="song_row_size_box">
                <div ref={song_row_ref} className="song_row">
                    <div ref={progress_ref} className="progress"></div>
                    <div className="cover">
                        <img src={(this_song_row_meta.cover_file_name ? server_paths.get_cover_file_by_it_name + this_song_row_meta.cover_file_name.name : random_cover)}/>
                    </div>
                    <div className="meta_part">
                        <h4 className="name">{this_song_row_meta.origin_name}</h4>
                        {this_song_row_meta.origin_author && <h4 className="author">{this_song_row_meta.origin_author}</h4>}
                        <h4 className="duration">{this_song_row_meta.duration}</h4>
                    </div>
                    <CheckInconstancy 
                        check_inner_checked={<i className="bi bi-pause-fill"></i>}
                        check_inner_unchecked={<i className="bi bi-play-fill"></i>}
                        check_checked_function={play}
                        check_unchecked_function={pause}
                        className={song_identifier} // По классу мы смотрим идентификатор песни, чтобы синхронизировать кнопки проигрывания.
                    />
                    <ButtonInconstancy btn_inner={<i className="bi bi-download"></i>} click_fn={download}/>
                </div>
            </div>
        )
    } else {
        return (<></>);
    }
}