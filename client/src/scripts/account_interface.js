import server_paths from "./server_paths";
import { axiosInstance } from "../context/backend_data_context";

async function create_account(login, password) {
    let response = await axiosInstance.post(server_paths.create_account,
        {
            login: login,
            password: password,
        }
    );

    return response.data;
}

async function create_account_by_ref(login_ref, password_ref, set_error_message) {
    let response = await create_account(login_ref.current.value, password_ref.current.value);

    if (set_error_message && !response.is_success) {
        set_error_message(response.data);
    }

    return response;
}

async function enter_account(login, password) {
    let response = await axiosInstance.post(server_paths.enter_account,
        {
            login: login,
            password: password,
        }
    );

    return response.data;
}

async function enter_account_by_ref(login_ref, password_ref, set_error_message) {
    let response = await enter_account(login_ref.current.value, password_ref.current.value);

    if (set_error_message && !response.is_success) {
        set_error_message(response.data);
    }

    return response;
}

async function exit_account() {
    let response = await axiosInstance.get(server_paths.exit_account);
    return response.data;
}

async function update_account_data(login, password, nickname, about) {
    let response = await axiosInstance.put(server_paths.update_account_data,
        {
            login: login,
            password: password,
            nickname: nickname,
            about: about,
        }
    );

    return response.data;
}

async function update_account_data_by_ref(login_ref, password_ref, nickname_ref, about_ref, set_error_message) {
    let response = await update_account_data(
        login_ref.current.value,
        password_ref.current.value,
        nickname_ref.current.value,
        about_ref.current.value,
    );

    if (set_error_message && !response.is_success) {
        set_error_message(response.data);
    }

    return response;
}

async function update_account_avatar(avatar_file) {
    let form_data = new FormData();
    form_data.append('file', avatar_file);
    let response = await axiosInstance.post(server_paths.update_account_avatar, form_data);

    return response.data;
}

async function update_account_avatar_by_ref(input_ref, rerender_fn, set_error_message) {
    let response = null;
    if (input_ref.current.files.length !== 0) {
        response = await update_account_avatar(input_ref.current.files[0]);
        if (response.is_success && rerender_fn) {
            // Функция которая ререндерит компонент при получение новой картинки.
            rerender_fn();
        } else if (set_error_message && !response.is_success) {
            set_error_message(response.data);
        }
    }

    return response;
}

// async function get_avatar(login) {
//     return await axiosInstance.post(server_paths.get_user_avatar, {login}, {responseType: "blob"});
// }

export { 
    create_account, 
    create_account_by_ref, 
    enter_account, 
    enter_account_by_ref,
    exit_account, 
    update_account_data, 
    update_account_data_by_ref,
    update_account_avatar,
    update_account_avatar_by_ref,
}