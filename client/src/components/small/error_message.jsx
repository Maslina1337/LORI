import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";
import "./error_message.css";

export default function ErrorMessage({inner_text}) {
    const inner_text_ref = useRef();
    const error_img_ref = useRef();
    const error_message_space_reservation_ref = useRef();
    const error_messege_ref = useRef();

    function error_appear() {
        const error_messege = error_messege_ref.current;
        const error_message_space_reservation = error_message_space_reservation_ref.current;
        const error_img = error_img_ref.current;

        let inner_text_height = parseFloat(getComputedStyle(inner_text_ref.current).height);
        let paddings = parseFloat(getComputedStyle(error_messege).paddingTop) + parseFloat(getComputedStyle(error_messege_ref.current).paddingBottom);

        let min_height = parseFloat(getComputedStyle(error_img).height) + parseFloat(getComputedStyle(error_img).bottom);
        let current_height = (inner_text_height + paddings);
        error_message_space_reservation.style.height = (min_height < current_height ? current_height : min_height) + "px";
        error_message_space_reservation.style.maxHeight = (min_height < current_height ? current_height : min_height) + "px";
    }

    function error_hide() {
        const error_messege = error_messege_ref.current;
        const error_message_space_reservation = error_message_space_reservation_ref.current;
        error_message_space_reservation.style.maxHeight = "0px";
    }

    useEffect(() => {
        if (inner_text === "") {
            error_hide();
        } else {
            error_appear();
        }
    })

    return (
        <div key={inner_text} ref={error_message_space_reservation_ref} className="error_message_space_reservation">
            <div ref={error_messege_ref} className="error_message">
                <h3 className="inner_text" ref={inner_text_ref}>{inner_text}</h3>
            </div>
            <img ref={error_img_ref} className="error_img" src="./imgs/warning_full.png" alt="warning" />
        </div>
    )
}

ErrorMessage.defaultProps = {
    inner_text: "",
}