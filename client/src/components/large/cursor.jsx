
/* Добовляй этот компонент в самый возможный низ.
 Он применяет прослушиватели событий к некоторым классам и,
если ты добавишь этот компонент вверх, то применять прослушиватели будет не к чему.*/

import React, { useEffect, useState, useRef } from "react";
import ReactDOM from 'react-dom';
import "./cursor.css";
import cursor_pos from "../../scripts/cursor_position_knowladge"

export default function WonderfulCursor() {

    const [isHiden, setIsHiden] = useState(true);
    const [isSmall, setIsSmall] = useState(false);
    // const [isPointer, setIsPointer] = useState(false);
    const [isInstantUpdate, setIsInstantUpdate] = useState(true);

    let currentIsInstantUpdate = true;

    const cursor_dot_ref = useRef();
    const cursor_circle_ref = useRef();

    useEffect(() => {
        window.addEventListener("mousemove", cursor_update);
        window.addEventListener("scroll", cursor_update);
        window.addEventListener("mousedown", onMousedown);
        window.addEventListener("mouseup", onMouseup);
        window.document.addEventListener("mouseleave", onMouseLeave);
        window.document.addEventListener("mouseenter", onMouseEnter);
        return () => {
            window.removeEventListener("mousemove", cursor_update);
            window.removeEventListener("scroll", cursor_update);
            window.removeEventListener("mousedown", onMousedown);
            window.removeEventListener("mouseup", onMouseup);
            window.document.removeEventListener("mouseleave", onMouseLeave);
            window.document.removeEventListener("mouseenter", onMouseEnter);
        }
    }, []);

    function get_current_is_instant_update() {
        setIsInstantUpdate((current) => {
            currentIsInstantUpdate = current;
        })
    }

    function cursor_update() {
        setIsHiden(false);
        const cursor_dot = cursor_dot_ref.current;
        const cursor_circle = cursor_circle_ref.current;

        cursor_dot.style.left = `${cursor_pos.x - ( parseInt((getComputedStyle(cursor_dot) ? getComputedStyle(cursor_dot).width : 0)) / 2 )}px`;
        cursor_dot.style.top = `${cursor_pos.y - ( parseInt((getComputedStyle(cursor_dot) ? getComputedStyle(cursor_dot).height : 0)) / 2 )}px`;

        get_current_is_instant_update();

        if (currentIsInstantUpdate) {
            cursor_circle.style.left = `${cursor_pos.x - ( parseInt((getComputedStyle(cursor_circle) ? getComputedStyle(cursor_circle).width : 0)) / 2 )}px`;
            cursor_circle.style.top = `${cursor_pos.y - ( parseInt((getComputedStyle(cursor_circle) ? getComputedStyle(cursor_circle).height : 0)) / 2 )}px`;
            setIsInstantUpdate(false);
        } else {
            cursor_circle.animate({
                left: `${cursor_pos.x - ( parseInt(getComputedStyle(cursor_circle).width) / 2 )}px`,
                top: `${cursor_pos.y - ( parseInt(getComputedStyle(cursor_circle).height) / 2 )}px`,
            }, {duration: 500, fill: "forwards"});
        }
    }

    const onMousedown = (event) => {
        setIsSmall(true);
    };

    const onMouseup = (event) => {
        setIsSmall(false);
    };

    const onMouseLeave = (event) => {
        setIsHiden(true);
        setIsInstantUpdate(true);
    }

    const onMouseEnter = (event) => {
        setIsHiden(false);
    }

    return (
        <>
            <div id="cursor_space">
                <div ref={cursor_dot_ref} id="cursor_dot" className={`${(isHiden ? "hiden" : "")}`}></div>
                <div ref={cursor_circle_ref} id="cursor_circle" className={`${(isHiden ? "hiden" : "")}${isHiden && isSmall ? ", " : ""}${(isSmall ? "small-circle" : "")}`}></div>
            </div>
        </>
    )
}