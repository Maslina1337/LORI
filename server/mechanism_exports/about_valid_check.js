"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.about_valid_check = void 0;
const public_server_values_1 = require("../data_management/public_server_values");
function about_valid_check(about) {
    if (about.length < public_server_values_1.public_server_values.min_user_about_length) {
        return { is_valid: false, message: `Как то мало подробностей. Мининум ${public_server_values_1.public_server_values.min_user_about_length} символов.` };
    }
    if (about.length > public_server_values_1.public_server_values.max_user_about_length) {
        return { is_valid: false, message: `Я не хочу знать о тебе настолько много подробностей. Максимум ${public_server_values_1.public_server_values.max_user_about_length} символов.` };
    }
    return { is_valid: true, message: "Данные прошли тест на валидность." };
}
exports.about_valid_check = about_valid_check;
