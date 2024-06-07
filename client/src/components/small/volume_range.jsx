import { useEffect, useRef, useState, useContext } from "react";
import "./volume_range.css";
import cursor_pos from "../../scripts/cursor_position_knowladge";
import { BackendDataContext } from "../../context/backend_data_context";
import { VolumeContext } from "../../context/volume_context"

export default function VolumeRange() {
    // Создание референсов.
    const volume_range_ref = useRef();
    const volume_lower_ref = useRef();
    const volume_range_empty_ref = useRef();
    const volume_range_progress_ref = useRef();
    const volume_higher_ref = useRef();
    const track_indicator_ref = useRef();
    const volume_count_ref = useRef();

    const time_to_hold = 300; // Время за которое будет срабатывать зажим кнопок.
    const change_interval = 50; // Интервал изменения громкости при зажиме.

    const { public_server_values } = useContext(BackendDataContext).get_backend_data;
    const { volume, set_volume } = useContext(VolumeContext)

    // Создание состояний.
    const [interval, set_interval] = useState(undefined);
    const [timeout, set_timeout] = useState(undefined);

    useEffect(() => {
        after_volume_set(volume);

        volume_lower_ref.current.addEventListener("mousedown", on_mousedown_lower);
        volume_lower_ref.current.addEventListener("mouseup", on_mouseup);
        volume_higher_ref.current.addEventListener("mousedown", on_mousedown_higher);
        volume_higher_ref.current.addEventListener("mouseup", on_mouseup);
        volume_range_empty_ref.current.addEventListener("mousedown", volume_range_empty_mousedown);

        return () => {
            volume_lower_ref.current.removeEventListener("mousedown", on_mousedown_lower);
            volume_lower_ref.current.removeEventListener("mouseup", on_mouseup);
            volume_higher_ref.current.removeEventListener("mousedown", on_mousedown_higher);
            volume_higher_ref.current.removeEventListener("mouseup", on_mouseup);
            volume_range_empty_ref.current.removeEventListener("mousedown", volume_range_empty_mousedown);
        }
    }, [])

    useEffect(() => {
        after_volume_set(volume);
    }, [volume])

    function volume_range_empty_mousedown(event) {
        if (event.which !== 1) return;
        change_volume_on_range(false);
        window.addEventListener("mousemove", change_volume_on_range);
        window.addEventListener("mouseup", volume_range_empty_mouseup);
    }

    function volume_range_empty_mouseup(event) {
        if (event.which !== 1) return;
        change_volume_on_range(true);
        window.removeEventListener("mousemove", change_volume_on_range);
        window.removeEventListener("mouseup", volume_range_empty_mouseup);
    }

    // Функция используется и как событие и как обычная.
    function change_volume_on_range(event) {
        if (event.which !== 1) return;
        let max_px_width = parseInt(window.getComputedStyle(volume_range_empty_ref.current).width);
        let current_px_width = cursor_pos.x - volume_range_empty_ref.current.getBoundingClientRect().left;
        let new_percent = Math.round(100 * ( current_px_width / max_px_width ));

        new_percent = clamp_volume(new_percent);
        set_volume(new_percent);
    }

    function clamp_volume(new_volume) {
        if (new_volume > 100) {
            new_volume = 100;
        } else if (new_volume < 0) {
            new_volume = 0;
        }
        return new_volume;
    }

    function after_volume_set(new_volume) {
        volume_range_progress_ref.current.style.width = String(new_volume) + "%";
    }

    function on_mousedown_lower(event) {
        if (event.which !== 1) return;
        lower_volume();
        set_timeout(setTimeout(lower_hold, time_to_hold));
    }

    function on_mousedown_higher(event) {
        if (event.which !== 1) return;
        higher_volume();
        set_timeout(setTimeout(higher_hold, time_to_hold));
    }

    function on_mouseup(event) {
        if (event.which !== 1) return;
        set_timeout((actual) => {
            if (actual) {
                clearTimeout(actual);
            }
            return undefined;
        })
        set_interval((actual) => {
            if (actual) {
                clearInterval(actual);
            }
            return undefined;
        })
    }

    function lower_hold() {
        set_interval(setInterval(lower_volume, change_interval))
    }

    function higher_hold() {
        set_interval(setInterval(higher_volume, change_interval))
    }

    function lower_volume() {
        set_volume((actual) => {
            actual = clamp_volume(actual - 1)
            return actual;
        });
    }

    function higher_volume() {
        set_volume((actual) => {
            actual = clamp_volume(actual + 1)
            return actual;
        });
    }

    let volume_button_event_listeners = {
        lower_unactive: () => {
            volume_lower_ref.current.innerHTML = `<i class="bi bi-caret-left" style="pointer-events: none;"></i>`;
        },
        higher_unactive: () => {
            volume_higher_ref.current.innerHTML = `<i class="bi bi-caret-right" style="pointer-events: none;"></i>`;
        },
        lower_active: () => {
            volume_lower_ref.current.innerHTML = `<i class="bi bi-caret-left-fill" style="pointer-events: none;"></i>`;
        },
        higher_active: () => {
            volume_higher_ref.current.innerHTML = `<i class="bi bi-caret-right-fill" style="pointer-events: none;"></i>`;
        },
    }

    return (
        <div ref={volume_range_ref} className="volume_range">
            <button ref={volume_lower_ref} className="volume_lower cursor_pointer" onMouseEnter={volume_button_event_listeners.lower_active} onMouseOut={volume_button_event_listeners.lower_unactive}>
                <i className="bi bi-caret-left"></i>
            </button>
            <div ref={volume_range_empty_ref} className="volume_range_empty cursor_none">
                <h1 ref={volume_count_ref} className="volume_count">{volume}</h1>
                <div ref={volume_range_progress_ref} className="volume_range_progress"></div>
            </div>
            <button ref={volume_higher_ref} className="volume_higher cursor_pointer" onMouseEnter={volume_button_event_listeners.higher_active} onMouseOut={volume_button_event_listeners.higher_unactive}>
                <i className="bi bi-caret-right"></i>
            </button>
            <div ref={track_indicator_ref} className="track_indicator"></div>
        </div>
    )
}