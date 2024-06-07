"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.password_valid_check = void 0;
const public_server_values_1 = require("../data_management/public_server_values");
function password_valid_check(password) {
    if (password.length < public_server_values_1.public_server_values.min_user_password_length) {
        return { is_valid: false, message: `Пароль слишком короткий. Мининум ${public_server_values_1.public_server_values.min_user_password_length} символов.` };
    }
    if (password.length > public_server_values_1.public_server_values.max_user_password_length) {
        return { is_valid: false, message: `Пароль слишком длинный. Максимум ${public_server_values_1.public_server_values.max_user_password_length} символов.` };
    }
    return { is_valid: true, message: "Данные прошли тест на валидность." };
}
exports.password_valid_check = password_valid_check;
