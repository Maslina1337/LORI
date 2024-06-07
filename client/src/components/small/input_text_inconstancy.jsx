import "./input_text_inconstancy.css";
import CheckPure from "./check_pure";
import ReactDOM from "react-dom";
import { useEffect, useRef, useState } from "react";

export default function InputTextInconstancy({value, placeholder, id, name, label, ref_parcel, edit_lock, view_ban, label_color, input_max_width}) {
    const locked_input_ref = useRef();

    const [is_hide, set_is_hide] = useState(view_ban);
    const [is_lock, set_is_lock] = useState(edit_lock);

    function on_hide_toggle() {
        if (view_ban && is_hide) {
            ref_parcel.current.type = "password";
            on_lock_toggle();
        } else {
            ref_parcel.current.type = "text";
            on_lock_toggle();
        }
    }

    function on_lock_toggle() {
        if (edit_lock && is_lock) {
            ref_parcel.current.style.display = "none"
            locked_input_ref.current.style.display = "block"
            if (is_hide) {
                let hiden_value = "";
                for (let i = 0; i < ref_parcel.current.value.length; i++) {
                    hiden_value += "•";
                }
                locked_input_ref.current.innerHTML = hiden_value;
            } else {
                locked_input_ref.current.innerHTML = ref_parcel.current.value;
            }
        } else {
            ref_parcel.current.style.display = "block"
            locked_input_ref.current.style.display = "none"
        }
    }

    useEffect(() => {
        on_hide_toggle();
    }, [is_hide])

    useEffect(() => {
        on_lock_toggle();
    }, [is_lock])

    function set_is_hide_true() {
        set_is_hide(true);
    }

    function set_is_hide_false() {
        set_is_hide(false);
    }

    function set_is_lock_true() {
        set_is_lock(true);
    }

    function set_is_lock_false() {
        set_is_lock(false);
    }

    useEffect(() => {
        ref_parcel.current.value = value;
        locked_input_ref.current.innerHTML = value;
    }, []);

    useEffect(() => {
        on_hide_toggle();
        on_lock_toggle();
    })

    return (
        <>
            <div className="input_box">
                {(label ? <label style={{color: label_color}} htmlFor={name}>{label}</label> : "")}
                {(edit_lock ? 
                    <CheckPure 
                    check_unchecked_function={set_is_lock_true}
                    check_checked_function={set_is_lock_false}
                    check_inner_unchecked={<i className="bi bi-pen"></i>}
                    check_inner_checked={<i className="bi bi-pen-fill"></i>}
                    checked={false}
                    />
                    :
                    ""
                )}
    
                {(view_ban ? 
                    <CheckPure 
                    check_unchecked_function={set_is_hide_true}
                    check_checked_function={set_is_hide_false}
                    check_inner_unchecked={<i className="bi bi-eye-fill"></i>}
                    check_inner_checked={<i className="bi bi-eye-slash-fill"></i>}
                    checked={false}
                    />
                    :
                    ""
                )}
                <div className="input_size_box">
                    <input style={{maxWidth: input_max_width}} autoComplete="off" ref={ref_parcel} id={id} name={name} className="input_text_inconstancy" type="text" placeholder={placeholder}/>
                    <div style={{maxWidth: input_max_width}} ref={locked_input_ref} className="locked_input"></div>
                </div>
            </div>
        </>
    )
}

InputTextInconstancy.defaultProps = {
    value: "",
    placeholder: "", 
    id: null, 
    name: "", 
    label: null, 
    edit_lock: false, 
    view_ban: false,
    label_color: "black",
    input_max_width: "auto",
}