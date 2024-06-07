import { useEffect, useRef, useState } from "react";
import ReactDOM from 'react-dom';
import "./check_pure.css";
import { AutoTextSize } from 'auto-text-size';

export default function CheckPure(props) {
    const check_unchecked_function = props.check_unchecked_function;
    const check_checked_function = props.check_checked_function;
    const check_inner_unchecked_html = props.check_inner_unchecked;
    const check_inner_checked_html = props.check_inner_checked;
    const checked = props.checked;
    const blend_type_style = (props.blend_type_style ? props.blend_type_style : "shift");

    const [currentChecked, setCurrentChecked] = useState(checked);

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
        setCurrentChecked((most_actual_checked) => {
            return !most_actual_checked;
        })
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
            <div className="check_pure_borders" onMouseEnter={onMouseEnter} onMouseOut={onMouseOut} onClick={switch_checked}>
                <div ref={check_blend_ref} className={"check_blend " + blend_type_style}></div>
                <AutoTextSize mode="boxoneline" className="check_inner">{(currentChecked ? check_inner_checked_html : check_inner_unchecked_html)}</AutoTextSize>
            </div>
        </>
    )
}