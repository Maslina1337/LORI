import { useEffect, useState, useRef, useContext} from "react";
import ReactDOM from 'react-dom';
import "./user_profile_card.css";

import server_paths from "../../scripts/server_paths";
import pages_paths from "../../scripts/pages_paths";

import { BackendDataContext } from "../../context/backend_data_context";
import { LifePageContentContext } from "../../context/life_page_content_context";

export default function UserProfileCard(props) {
    const account = props.account;

    const { private_account_data, public_server_values } = useContext(BackendDataContext).get_backend_data;
    const {life_page_content, set_life_page_content} = useContext(LifePageContentContext);

    const [avatar, set_avatar] = useState();
    const [nickname, set_nickname] = useState(public_server_values.guest_name);

    const user_profile_card_ref = useRef();
    const fade_ref = useRef();

    let is_authorized = private_account_data.is_success;

    useEffect(() => {
        // Нам нужен конкретный аккаунт? Или собственный?
        if (account) {

        } else {
            if (is_authorized) {
                // Штука с датой в конце нужна, чтобы реакт думал, что картинка новая, хотя ссылка вроде та же.
                set_avatar(server_paths.get_user_avatar + private_account_data.data.login + "?" + Date.now());

                set_nickname(private_account_data.data.nickname);
            } else {
                set_avatar("./imgs/guest_avatar.jpg");
                set_nickname(public_server_values.guest_name);
            }
        }
    }, []);

    useEffect(() => {
        if (is_authorized) {
            // Штука с датой в конце нужна, чтобы реакт думал, что картинка новая, хотя ссылка вроде та же.
            set_avatar(server_paths.get_user_avatar + private_account_data.data.login + "?" + Date.now());
            set_nickname(private_account_data.data.nickname);
        }
    }, [private_account_data]);

    function onMouseEnter(event) {
        fade_ref.current.classList.add("fade_show");
    }

    function onMouseOut(event) {
        fade_ref.current.classList.remove("fade_show");
    }

    function onClick(event) {
        if (is_authorized) {
            set_life_page_content("profile_edit");
        } else {
            window.location = pages_paths.birth_page;
        }
    }

    return (
        <>
            <div className="place_reservation">
                <div ref={user_profile_card_ref} className="user_profile_card" onMouseEnter={onMouseEnter} onMouseOut={onMouseOut} onClick={onClick}>
                    <div className="picture_part">
                        <img className="picture_part_img" src={avatar} alt="avatar"/>
                        <div ref={fade_ref} className="fade">
                            {account ? <i class="bi bi-aspect-ratio"></i> : (is_authorized ? <i className="bi bi-gear-fill"></i> : <i className="bi bi-door-open-fill"></i>)}
                        </div>
                    </div>
                    <div className="text_part">
                        <h6>{nickname}</h6>
                    </div>
                </div>
            </div>
        </>
    )
}