import { useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom';
import "./check_inconstancy.css";

export default function CheckInconstancy({ check_unchecked_function, check_checked_function, check_inner_unchecked, check_inner_checked, checked, check_inconstancy_borders_styles, check_inner_styles, className }) {

    const [currentChecked, setCurrentChecked] = useState(checked);

    const check_inner_ref = useRef();
    const check_blend_ref = useRef();

    useEffect(() => {
        setCurrentChecked(checked);
    }, [])

    useEffect(() => {
        if (currentChecked) {
            check_checked_function();
        } else {
            check_unchecked_function();
        }
    }, [currentChecked]);

    function switch_checked() {
        setCurrentChecked(!currentChecked);
    }

    // Эвенты.
    function onMouseEnter(event) {
        check_blend_ref.current.classList.add("inconstancy");
    }

    function onMouseOut(event) {
        check_blend_ref.current.classList.remove("inconstancy");
    }

    return (
        <>
            <button className={`check_inconstancy_borders${(currentChecked ? " checked" : "")}${className ? " " + className : ""}`} style={check_inconstancy_borders_styles} onMouseEnter={onMouseEnter} onMouseOut={onMouseOut} onClick={switch_checked}>
                <div ref={check_blend_ref} className={"check_blend"}></div>
                    <h3 ref={check_inner_ref} className="check_inner" style={check_inner_styles}>{(currentChecked ? check_inner_checked : check_inner_unchecked)}</h3>
            </button>
        </>
    )
}

CheckInconstancy.defaultProps = {
    check_unchecked_function: () => {},
    check_checked_function: () => {},
    check_inner_unchecked: "",
    check_inner_checked: "",
    checked: false,
    check_inconstancy_borders_styles: {},
    check_inner_styles: {},
    className: "",
}