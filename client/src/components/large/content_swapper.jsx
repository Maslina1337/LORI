// Этот компонент нужен для красивых переходов между разным контентом.

import "./content_swapper.css";
import { createRef, useContext, useEffect, useRef, useState } from "react";

// Контент
import Playlists from "../content/playlists";
import PersonalPlaylist from "../content/personal_playlist";
import ProfileEdit from "../content/profile_edit";
import SongUpload from "../content/song_upload.jsx";
import Search from "../content/search.jsx";

const content_path_obj = {
    "playlists": (<Playlists/>),
    "profile_edit": (<ProfileEdit/>),
    "search": (<Search/>),
    "song_upload": (<SongUpload/>),
    "personal_playlist": (<PersonalPlaylist/>)
}

// Время за которое один контент сменяет другой.
const time_to_swap = 700;

export default function ContentSwapper({ content_key }) {
    const content_ref = useRef();
    const swapper_1_ref = useRef();
    const swapper_2_ref = useRef();
    const appear_effect_1_ref = useRef();
    const appear_effect_2_ref = useRef();

    const [is_swapping, set_is_swapping] = useState(false);

    const [current_content, set_current_content] = useState({
        // Хранит номер последнего появлявившегося контента.
        static: 1,

        // Текущий отображаемый контент.
        sw1: "",
        sw2: "",
    });

    function swap_content(content_key) {
        // Не допускаеться менять контент во время смены контента.
        if (is_swapping || !content_ref.current || !swapper_1_ref.current || !swapper_2_ref.current || !appear_effect_1_ref.current || !appear_effect_2_ref.current || !content_key) {
            return;
        }

        // Если контент тот же.
        if (content_key === (current_content.static === 1 ? current_content.sw1 : current_content.sw2)) {
            return;
        }

        const content_max_height = parseFloat(content_ref.current.getBoundingClientRect().height);

        const sw_DOM = {
            sw1: swapper_1_ref.current,
            sw2: swapper_2_ref.current,
        }

        const appear_effect_DOM_for_swapper = {
            sw1: appear_effect_1_ref.current,
            sw2: appear_effect_2_ref.current,
        }

        set_is_swapping(true);

        const switch_from_swapper = { 
            number: current_content.static,
            name: (current_content.static === 1 ? "sw1" : "sw2"),
        };

        const switch_to_swapper = { 
            number: (current_content.static === 1 ? 2 : 1),
            name: (current_content.static === 1 ? "sw2" : "sw1"),
        };

        set_current_content((actual) => {
            return {
                ...actual,
                static: switch_to_swapper.number,
                [switch_to_swapper.name]: content_key,
            }
        })

        // Класс, который сдвигает этот контент выше другого (по оси Z).
        sw_DOM[switch_to_swapper.name].classList.add("on_top");
        sw_DOM[switch_from_swapper.name].classList.remove("on_top");

        sw_DOM[switch_from_swapper.name].style.pointerEvents = "none";
        sw_DOM[switch_to_swapper.name].style.pointerEvents = "auto";

        sw_DOM[switch_to_swapper.name].getElementsByClassName("sw_content")[0].style.overflow = "hidden";
        sw_DOM[switch_to_swapper.name].getElementsByClassName("sw_content")[0].style.minHeight = content_max_height + "px",

        sw_DOM[switch_to_swapper.name].animate([
            {
                maxHeight: "0px",
            },
            {
                maxHeight: content_max_height + "px",
            },
        ], {duration: time_to_swap, fill: "forwards", easing: "ease-in-out"});

        appear_effect_DOM_for_swapper[switch_to_swapper.name].animate([
            {
                height: "100px",
            },
            {
                height: "0px",
            }
        ], {duration: time_to_swap, fill: "forwards"})

        setTimeout(() => {
            sw_DOM[switch_to_swapper.name].getElementsByClassName("sw_content")[0].style.overflow = "auto";
            set_is_swapping(false);
        }, time_to_swap);
    }

    if (current_content["sw" + current_content.static] !== content_key) {
        swap_content(content_key);
    }

    useEffect(() => {
        swap_content(content_key);
    }, [])

    return (
        <>
            <div ref={content_ref} className="content">
                <div ref={swapper_1_ref} className="swapper_1 on_top">
                    <div className="sw_content">
                        {(!is_swapping && current_content.static === 1 || is_swapping ? content_path_obj[current_content.sw1] : "")}
                    </div>
                    <div ref={appear_effect_1_ref} className="appear_effect"></div>
                </div>

                <div ref={swapper_2_ref} className="swapper_2">
                    <div className="sw_content">
                        {(!is_swapping && current_content.static === 2 || is_swapping ? content_path_obj[current_content.sw2] : "")}
                    </div>
                    <div ref={appear_effect_2_ref} className="appear_effect"></div>
                </div>
            </div>
        </>
    )
}