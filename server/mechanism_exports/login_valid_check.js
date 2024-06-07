"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login_valid_check = void 0;
const public_server_values_1 = require("../data_management/public_server_values");
function login_valid_check(login) {
    if (login.length < public_server_values_1.public_server_values.min_user_login_length) {
        return { is_valid: false, message: `Логин слишком короткий. Мининум ${public_server_values_1.public_server_values.min_user_login_length} символов.` };
    }
    if (login.length > public_server_values_1.public_server_values.max_user_login_length) {
        return { is_valid: false, message: `Логин слишком длинный. Максимум ${public_server_values_1.public_server_values.max_user_login_length} символов.` };
    }
    return { is_valid: true, message: "Данные прошли тест на валидность." };
}
exports.login_valid_check = login_valid_check;
