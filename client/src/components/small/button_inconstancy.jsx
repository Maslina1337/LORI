import { useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import "./button_inconstancy.css";

export default function ButtonInconstancy({btn_inner, click_fn, btn_borders_styles, btn_inner_styles, title}) {
    const btn_inner_ref = useRef();
    const btn_blend_ref = useRef();
    
    function onMouseEnter(event) {
        btn_blend_ref.current.classList.add("inconstancy");
    }

    function onMouseOut(event) {
        btn_blend_ref.current.classList.remove("inconstancy");
    }

    return (
        <>
            <button className="btn_borders" title={title} style={btn_borders_styles} onMouseEnter={onMouseEnter} onMouseOut={onMouseOut} onClick={click_fn}>
                <div ref={btn_blend_ref} className="btn_blend"></div>
                <h3 ref={btn_inner_ref} style={btn_inner_styles} className="btn_inner">{btn_inner}</h3>
            </button>
        </>
    )
}

ButtonInconstancy.defaultProps = {
    btn_inner: "", 
    click_fn: () => {}, 
    btn_borders_styles: {},
    btn_inner_styles: {},
    title: "",
}