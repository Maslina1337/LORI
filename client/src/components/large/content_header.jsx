import { useContext, useState, useEffect } from "react";
import "./content_header.css"

import { LifePageContentContext } from "../../context/life_page_content_context";

import pages_paths from "../../scripts/pages_paths";

import ButtonInconstancy from "../small/button_inconstancy";
import { BackendDataContext } from "../../context/backend_data_context";

const max_history_remember = 10;

export default function ContentHeader() {
    const [content_history_list, set_content_history_list] = useState([]);
    const [content_history_current, set_content_history_current] = useState(0);

    const {life_page_content, set_life_page_content} = useContext(LifePageContentContext);

    const { private_account_data, public_server_values } = useContext(BackendDataContext).get_backend_data;

    function add_to_history(content) {
        if (!content || content === content_history_list[content_history_list.length - 1]) {
            return;
        }

        set_content_history_list((list) => {
            // Применение ограничения по длинне истории.
            while (list.length > max_history_remember - 1) {
                list.shift();
            }

            list.push(content);

            set_content_history_current(0);

            return list;
        })
    }

    function set_content_playlists() {
        set_life_page_content("playlists");
    }

    function set_content_personal_playlist() {
        set_life_page_content("personal_playlist");
    }

    function set_content_song_upload() {
        set_life_page_content("song_upload");
    }

    function set_content_search() {
        set_life_page_content("search");
    }

    function history_back() {
        set_content_history_current((current) => {
            if (current < max_history_remember - 1 && current < content_history_list.length - 1) {
                current++;
            }
            
            return current;
        })
    }

    function history_next() {
        set_content_history_current((current) => {
            if (current > 0) {
                current--;
            }
            
            return current;
        })
    }

    useEffect(() => {
        set_life_page_content(content_history_list[content_history_list.length - content_history_current - 1]);
    }, [content_history_current]);

    useEffect(() => {
        if (content_history_current === 0) {
            add_to_history(life_page_content);
        }
    }, [life_page_content]);

    return (
        <ul className="content_header">
            <li className="history_buttons">
                <ButtonInconstancy 
                btn_inner={<i className="bi bi-caret-left-fill"></i>}
                click_fn={history_back}
                btn_borders_styles={{
                    padding: "3px 30px",
                }}
                />
                <div className="split"></div>
                <ButtonInconstancy 
                btn_inner={<i className="bi bi-caret-right-fill"></i>}
                click_fn={history_next}
                btn_borders_styles={{
                    padding: "3px 30px",
                }}
                />
            </li>
            <li>
                <ul className="navigation_buttons">
                    <li>
                        <ButtonInconstancy 
                        btn_inner={<i className="bi bi-search"></i>}
                        click_fn={set_content_search}
                        btn_borders_styles={{
                            padding: "3px 30px",
                        }}
                        title={"Поиск"}
                        />
                    </li>
                    <li>
                        <ButtonInconstancy 
                        btn_inner={<i className="bi bi-music-note-list"></i>}
                        click_fn={set_content_playlists}
                        btn_borders_styles={{
                            padding: "3px 30px",
                        }}
                        title={"Плейлисты"}
                        />
                    </li>
                    <li>
                        <ButtonInconstancy 
                        btn_inner={<i className="bi bi-ear-fill"></i>}
                        click_fn={set_content_personal_playlist}
                        btn_borders_styles={{
                            padding: "3px 30px",
                        }}
                        title={"Свалка"}
                        />
                    </li>
                    <li>
                        <ButtonInconstancy 
                        btn_inner={<i className="bi bi-plus-circle-dotted"></i>}
                        click_fn={(private_account_data.is_success ? set_content_song_upload : () => {window.location = pages_paths.birth_page})}
                        btn_borders_styles={{
                            padding: "3px 30px",
                        }}
                        title={"Добавить песню"}
                        />
                    </li>
                </ul>
            </li>
        </ul>
    )
}