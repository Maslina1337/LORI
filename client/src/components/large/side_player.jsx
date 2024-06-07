import { useEffect, useRef, useState, useContext } from "react";
import "./side_player.css";
import ReactDOM from "react-dom";
import ButtonInconstancy from "../small/button_inconstancy";
import CheckInconstancy from "../small/check_inconstancy"
import VolumeRange from "../small/volume_range";
import song_interface from "../../scripts/song_interface";
import server_paths from "../../scripts/server_paths";

import { SongCurrentSelectContext } from "../../context/song_current_select_context";

export default function SidePlayer(props) {
    const side_player_keeper_ref = useRef();
    const side_player_ref = useRef();
    const song_cover_part_ref = useRef();
    const appear_effect_ref = useRef();
    
    const set_own_functions = props.set_own_functions;

    const { cover, meta, identifier, set_is_playing } = useContext(SongCurrentSelectContext);

    function play() {
        set_is_playing(song_interface.play(song_interface));
    }

    function pause() {
        set_is_playing(song_interface.pause(song_interface));
    }

    function player_appear() {
        side_player_keeper_ref.current.classList.remove("hiden");
        const appear_effect = appear_effect_ref.current;
        appear_effect.style.maxWidth = "100px";
        appear_effect.animate({
            maxWidth: "0px",
        }, {duration: 500, fill: "forwards"});
    }

    function player_hide() {
        side_player_keeper_ref.current.classList.add("hiden");
        const appear_effect = appear_effect_ref.current;
        appear_effect.style.maxWidth = "0px";
        appear_effect.animate({
            maxWidth: "100px",
        }, {duration: 500, fill: "forwards"});
    }

    useEffect(() => {
        const song_cover_part = song_cover_part_ref.current;
        const size = getComputedStyle(song_cover_part).width;
        
        song_cover_part.style.maxWidth = size;
        song_cover_part.style.maxHeight = size;
        song_cover_part.style.width = size;
        song_cover_part.style.height = size;
        song_cover_part.style.minWidth = size;
        song_cover_part.style.minHeight = size;

        set_own_functions({
            appear: player_appear,
            hide: player_hide,
        });
    }, []);

    return (
        <>
        <div ref={side_player_keeper_ref} className="side_player_keeper hiden">
            <div ref={side_player_ref} className="side_player">
                <div ref={song_cover_part_ref} className="song_cover_part">
                    <div className="cover_decoration"></div>
                    <img className="song_cover_img" src={(cover ? cover : "./imgs/no_song.png")}/>
                </div>
                <div className="song_name_part">
                    <h2 className="song_name_text">
                        {(meta ? meta.origin_name : "Песня не выбрана.")}
                    </h2>
                </div>
                <div className="media_control_buttons">
                    <ButtonInconstancy btn_inner={<i className="bi bi-skip-backward-fill"></i>}/>
                    <CheckInconstancy 
                        check_inner_checked={<i className="bi bi-pause-fill"></i>}
                        check_inner_unchecked={<i className="bi bi-play-fill"></i>}
                        check_checked_function={play}
                        check_unchecked_function={pause}
                        className={(identifier ? "id_" + identifier : "")}
                    />
                    <ButtonInconstancy btn_inner={<i className="bi bi-skip-forward-fill"></i>}/>
                </div>
                <div className="volume_part">
                    <VolumeRange/>
                </div>
            </div>

            <div ref={appear_effect_ref} className="appear_effect"></div>
        </div>
        </>
    )
}