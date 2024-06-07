"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.nickname_valid_check = void 0;
const public_server_values_1 = require("../data_management/public_server_values");
function nickname_valid_check(nickname) {
    if (nickname.length < public_server_values_1.public_server_values.min_user_nickname_length) {
        return { is_valid: false, message: `Никнейм слишком короткий. Мининум ${public_server_values_1.public_server_values.min_user_nickname_length} символов.` };
    }
    if (nickname.length > public_server_values_1.public_server_values.max_user_nickname_length) {
        return { is_valid: false, message: `Никнейм слишком длинный. Максимум ${public_server_values_1.public_server_values.max_user_nickname_length} символов.` };
    }
    return { is_valid: true, message: "Данные прошли тест на валидность." };
}
exports.nickname_valid_check = nickname_valid_check;
