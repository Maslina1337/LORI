import "./profile_edit.css";

import InputTextInconstancy from "../small/input_text_inconstancy";
import InconstancyInputForm from "../large/inconstancy_input_form";
import ButtonInconstancy from "../small/button_inconstancy";
import ErrorMessage from "../small/error_message";
import { useContext, useRef, useState } from "react";
import { BackendDataContext } from "../../context/backend_data_context";
import { exit_account, update_account_avatar_by_ref, update_account_data_by_ref } from "../../scripts/account_interface";
import server_paths from "../../scripts/server_paths";

export default function ProfileEdit() {
    const [error_message, set_error_message] = useState("");

    const { send_all_requests } = useContext(BackendDataContext);

    const login_ref = useRef();
    const password_ref = useRef();
    const nickname_ref = useRef();
    const about_ref = useRef();
    const avatar_ref = useRef();

    const { public_server_values, private_account_data } = useContext(BackendDataContext).get_backend_data;

    async function submit_data() {
        const update_data_status = await update_account_data_by_ref(login_ref, password_ref, nickname_ref, about_ref, avatar_ref, set_error_message);
        if (update_data_status.is_success) {
            send_all_requests();
        }
    }

    async function submit_avatar() {
        const update_avatar_status = await update_account_avatar_by_ref(avatar_ref, set_error_message);
        if (update_avatar_status.is_success) {
            send_all_requests();
        }
    }

    async function exit() {
        const exit_status = await exit_account();
        if (exit_status.is_success) {
            window.location.reload();
        }
    }

    return (
        <div className="profile_edit_size_box">
            <h2>Редактор профиля</h2>
            <div className="form_size_box">
                <div className="avatar_edit_part">
                    <label htmlFor="avatar_input" style={{color: "white"}}>Аватар</label>
                    <input ref={avatar_ref} accept={public_server_values.valid_avatar_extnames.join(",")} type="file" name="avatar_input"/>
                    <ButtonInconstancy btn_inner={"Сохранить аватар"} click_fn={submit_avatar}/>
                </div>
                <InconstancyInputForm required_inputs={
                    [
                        {type: "text", value: private_account_data.data.login, ref_parcel: login_ref, label: "Логин", edit_lock: true},
                        {type: "text", value: private_account_data.data.password, ref_parcel: password_ref, label: "Пароль", edit_lock: true, view_ban: true},
                        {type: "text", value: private_account_data.data.nickname, ref_parcel: nickname_ref, label: "Никнейм"},
                        {type: "text", value: private_account_data.data.about, ref_parcel: about_ref, label: "О себе"},
                    ]
                }/>
                {(error_message !== "" ? <ErrorMessage inner_text={error_message}/> : "")}
                <div className="bottom_buttons">
                    <ButtonInconstancy btn_inner={"Выйти из аккаунта"} click_fn={exit}/>
                    <ButtonInconstancy btn_inner={"Сохранить данные"} click_fn={submit_data} btn_borders_styles={{flexGrow: 1}}/>
                </div>
            </div>
        </div>
    )
}