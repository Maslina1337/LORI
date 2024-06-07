import React, { useEffect, useState } from "react";
import axios from "axios";

import LoadingScreen from "../components/large/loading_screen";

// Пути на сервере
import server_paths from '../scripts/server_paths';

export const BackendDataContext = React.createContext();

export function BackendDataProvider({ children }) {
    const [get_backend_data, set_backend_data] = useState({});

    const [sended_requests_info, set_sended_requests_info] = useState({
        // Переменная отвечает за то, сколько на загрузке страницы улетело запросов на получение информации 
        // (не картинки и т.д. а например public_server_values)
        count_of_sends: 0,
        there_any_sended: false,
    });

    async function send_get_request({
        url,
        key_name,
        response_data_handler,
    }) {
        axiosInstance.get(url).then((response) => {
            set_backend_data((current_backend_data) => ({
                ...current_backend_data,
                [key_name]: (response_data_handler ? response_data_handler(response.data) : response.data),
            }));
        });
    }
    
    async function send_post_request({
        url,
        body,
        response_type,

        key_name,
        response_data_handler,
    }) {
        axiosInstance.post(url, body, response_type).then((response) => {
            set_backend_data((current_backend_data) => ({
                ...current_backend_data,
                [key_name]: (response_data_handler ? response_data_handler(response.data) : response.data),
            }));
        });
    }

    async function send_all_requests() {
        // Отправка запросов.
        send_get_request({
            url: server_paths.get_public_server_values,
            key_name: "public_server_values",
        });
        send_get_request({
            url: server_paths.get_private_account_data,
            key_name: "private_account_data",
        });

        set_sended_requests_info({
            count_of_sends: 2, // <---- Если меняешь кол-во запросов изменяй и это.
            there_any_sended: true,
        });
    }

    useEffect(() => {
        send_all_requests();
    }, [])

    return (
        <>
            {(!sended_requests_info.there_any_sended ?
                <LoadingScreen gif="./imgs/loading_full.gif"/>
            :
            (sended_requests_info.count_of_sends > Object.keys(get_backend_data).length ? 
                <LoadingScreen gif="./imgs/loading_full.gif"/>
            :
            <BackendDataContext.Provider value={{get_backend_data, set_backend_data, send_all_requests}}>
                {children}
            </BackendDataContext.Provider>
            )
            )}
        </>
    )
}

// Инстанс Axios.
const axiosInstance = axios.create({ 
    withCredentials: true, 
    baseURL: "http://localhost:1337", 
});

export { axiosInstance };