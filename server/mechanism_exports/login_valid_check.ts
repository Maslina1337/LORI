import { public_server_values } from "../data_management/public_server_values";

function login_valid_check(login: string): { is_valid: boolean, message: string } {
    if (login.length < public_server_values.min_user_login_length) {
        return { is_valid: false, message: `Логин слишком короткий. Мининум ${public_server_values.min_user_login_length} символов.` };
    }
    if (login.length > public_server_values.max_user_login_length) {
        return { is_valid: false, message: `Логин слишком длинный. Максимум ${public_server_values.max_user_login_length} символов.` };
    }
    return { is_valid: true, message: "Данные прошли тест на валидность." };
}

export { login_valid_check };