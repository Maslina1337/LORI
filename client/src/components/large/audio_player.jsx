import { useContext, useEffect, useRef, useState, useSyncExternalStore } from "react";
import song_interface from "../../scripts/song_interface";

import { VolumeContext } from "../../context/volume_context";
import { SongCurrentSelectContext } from "../../context/song_current_select_context";
import { SongCurrentTimeContext } from "../../context/song_current_time_context";

const audio_max = 40; // По факту этот проигрыватель долбит жесткий басс. Так что не помешает ограничить его.

// Компонент проигрывает музыку на сайте.
export default function AudioPlayer() {
    const audio_player_ref = useRef();
    const audio_source_ref = useRef();

    const { volume } = useContext(VolumeContext);
    const { song, is_playing, set_cover, set_meta, set_identifier, set_song } = useContext(SongCurrentSelectContext);
    const { set_current_time, set_duration } = useContext(SongCurrentTimeContext);

    const [is_loaded, set_is_loaded] = useState(false);
    const [on_load_functions, set_on_load_functions] = useState([]);

    function progress(current_time, duration) {
        song_interface.current_select.current_time = current_time;

        // Полное время можно было бы взять из самой меты, как варик.
        song_interface.current_select.duration = duration;
        set_duration(duration);

        set_current_time(current_time);
    }

    function is_playing_check() {
        // Когда музыка подгружена.
        if (is_playing === null) return;

        if (is_playing) {
            audio_player_ref.current.play();
        } else {
            audio_player_ref.current.pause();
        }
    }

    useEffect(() => {
        if (audio_player_ref.current && volume) {
            const new_volume = Math.round(Number(volume) / 100 * audio_max) / 100;
            audio_player_ref.current.volume = new_volume;
        }
    }, [volume]);

    useEffect(() => {
        song_interface.audio_player_ref = audio_player_ref;

        audio_player_ref.current.addEventListener("timeupdate", () => {
            progress(audio_player_ref.current.currentTime, audio_player_ref.current.duration);
        })
    }, []);

    useEffect(() => {
        set_is_loaded(false);
        audio_player_ref.current.load();

        function set_is_loaded_true() {
            set_is_loaded(true)
        }
        audio_player_ref.current.addEventListener("canplay", set_is_loaded_true);

        return () => {
            audio_player_ref.current.removeEventListener("canplay", set_is_loaded_true);
        };
    }, [song])

    useEffect(() => {
        if (is_loaded) {
            is_playing_check();
        } else {
            set_on_load_functions((actual) => {
                return [...actual, is_playing_check];
            })
        }
    }, [is_playing])

    useEffect(() => {
        if (is_loaded) {
            on_load_functions.forEach((element) => {
                element();
            })
        }
    }, [is_loaded])

    return (
        <audio ref={audio_player_ref} style={{position: "absolute", top: 0, left: "1000px", display: "none"}} controls id="side_player_audio">
            <source ref={audio_source_ref} src={song}/>
        </audio>
    )
}