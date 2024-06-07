import { useEffect, useRef, useState } from "react";
import "./birth_page.css";
import LiveLogotype from "../components/small/live_logotype";
import ButtonInconstancy from "../components/small/button_inconstancy";
import InputTextInconstancy from "../components/small/input_text_inconstancy";
import ErrorMessage from "../components/small/error_message";
import ReactDOM from "react-dom";
import pages_paths from "../scripts/pages_paths";
import server_paths from "../scripts/server_paths";
import CheckInconstancy from "../components/small/check_inconstancy";
import { enter_account_by_ref, create_account_by_ref } from "../scripts/account_interface";

// Страница на которой рождается твой аккаунт.
export default function BirthPage() {
    const login_input_ref = useRef();
    const password_input_ref = useRef();

    const [error_message, set_error_message] = useState("");
    const [is_auth, set_is_auth] = useState(true);

    const inputs = [
        {ref_parcel: login_input_ref, label: "Логин:", id: "login_input", name: "login_input", type: "text"},
        {ref_parcel: password_input_ref, label: "Пароль:", id: "password_input", name: "password_input", type: "text"}
    ]

    async function submit() {
        let response;
        if (is_auth) {
            response = await enter_account_by_ref(login_input_ref, password_input_ref);
        } else {
            response = await create_account_by_ref(login_input_ref, password_input_ref);
        }
        
        if (await response.is_success) {
            window.location = pages_paths.life_page;
        } else {
            set_error_message(response.data);
        }
    }

    function set_is_auth_to_false() {
        set_is_auth(false);
    }

    function set_is_auth_to_true() {
        set_is_auth(true);
    }

    useEffect(() => {
        login_input_ref.current.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                submit();
            }
        })
        password_input_ref.current.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                submit();
            }
        })
    }, []);

    return (
        <>
        <div className="screen_size_box">
            <div className="birth_page_bg">
                <div className="logotype_line">
                    <LiveLogotype text="LORI"/>
                </div>

                <div className="auth_reg_switch">
                    <span>Я здесь чтобы </span>
                    <span>
                        {/* Это авторизация? */}
                        <CheckInconstancy 
                        check_unchecked_function={set_is_auth_to_false}
                        check_checked_function={set_is_auth_to_true}
                        check_inner_unchecked={"зарегистрироваться."}
                        check_inner_checked={"авторизоваться."}
                        checked={true}
                        />
                    </span>
                </div>

                <div className="inputs_line">
                    <InputTextInconstancy ref_parcel={login_input_ref} label="Логин:" id="login_input" name="login_input"/>
                    <InputTextInconstancy ref_parcel={password_input_ref} label="Пароль:" id="password_input" name="password_input" view_ban={(is_auth ? {default: true} : false)}/>
                    {(error_message !== "" ? <ErrorMessage inner_text={error_message}/> : "")}
                </div>
                
                <ButtonInconstancy btn_inner={(is_auth ? "Войти" : "Создать")} click_fn={submit}/>
            </div>
            <div className="floating_return_btn">
                <ButtonInconstancy btn_inner={<i className="bi bi-caret-left-fill"></i>} click_fn={() => {
                    window.location = (document.referrer.indexOf(pages_paths.birth_page) !== -1 ? pages_paths.life_page : document.referrer);
                }}/>
            </div>
        </div>
        </>
    )
}