import { useContext, useEffect, useRef, useState } from "react"
import { SongCurrentSelectContext } from "../../context/song_current_select_context";
import song_interface from "../../scripts/song_interface";
import { SongCurrentTimeContext } from "../../context/song_current_time_context";
import cursor_pos from "../../scripts/cursor_position_knowladge";
import "./song_track.css";

export default function SongTrack() {

    // const [it_was_playing_before_touch, set_it_was_playing_before_touch] = useState(false);

    const song_track_size_box_ref = useRef();
    const current_time_ref = useRef();
    const empty_ref = useRef();
    const downloaded_ref = useRef();
    const progress_ref = useRef();
    const duration_ref = useRef();

    const { identifier, set_is_playing, is_playing } = useContext(SongCurrentSelectContext);
    const { current_time, duration } = useContext(SongCurrentTimeContext);

    useEffect(() => {
        song_interface.song_track_ref = song_track_size_box_ref;

        song_track_size_box_ref.current.addEventListener("mousedown", on_mouse_down);
        song_track_size_box_ref.current.addEventListener("mouseup", on_mouse_up);
    }, [])

    function seconds_to_time(sec) {
        return (sec > 3600 ? new Date(sec * 1000).toISOString().slice(11, 19) : 
        new Date(sec * 1000).toISOString().slice(14, 19));
    }

    // Функция вызывающаяся много раз за секунду.
    function progress(current_time_sec, duration_sec) {
        if (progress_ref.current) {
            const procent = current_time_sec / duration_sec * 100;
            progress_ref.current.style.maxWidth = procent + "%";
        }

        if (current_time_ref.current) {
            current_time_ref.current.innerHTML = seconds_to_time(current_time_sec);
        }
    }

    function set_in_range() {
        let max_px_width = parseInt(window.getComputedStyle(empty_ref.current).width);
        let current_px_width = cursor_pos.x - empty_ref.current.getBoundingClientRect().left;
        let new_percent = current_px_width / max_px_width;

        if (new_percent > 1) {
            new_percent = 1;
        } else if (new_percent < 0) {
            new_percent = 0;
        }

        const new_seconds = song_interface.current_select.duration * new_percent;

        song_interface.audio_player_ref.current.currentTime = new_seconds;
    }

    function on_mouse_down(event) {
        if (event.which !== 1) return;
        set_in_range();
        // const _is_playing = (song_track_size_box_ref.current.getAttribute("is_playing") === "true");
        // set_it_was_playing_before_touch(_is_playing);
        set_is_playing(song_interface.pause(song_interface));
        window.addEventListener("mousemove", set_in_range);
    }

    function on_mouse_up(event) {
        debugger;
        if (event.which !== 1) return;
        window.removeEventListener("mousemove", set_in_range);
        
        set_is_playing(true) // Кастыль

        // if (it_was_playing_before_touch) {
        //     set_is_playing(song_interface.play(song_interface));
        // }
    }

    // useEffect(() => {
    //     song_track_size_box_ref.current.setAttribute("is_playing", is_playing);
    // }, [is_playing])

    useEffect(() => {
        progress(current_time, duration);
    }, [current_time])

    if (identifier && duration) {
        return (
            <div ref={song_track_size_box_ref} className="song_track_size_box">
                <div ref={current_time_ref} className="current_time"></div>
                <div ref={empty_ref} className="empty">
                    {/* <div ref={downloaded_ref} className="downloaded"></div> */}
                    <div ref={progress_ref} className="progress"></div>
                </div>
                <h3 ref={duration_ref} className="duration"></h3>
            </div>
        )
    } else {
        return (
            <div ref={song_track_size_box_ref} className="song_track_size_box">

            </div>
        )
    }
}