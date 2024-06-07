"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.create_account = void 0;
const account_manager_js_1 = require("../data_management/account_manager.js");
function create_account(login, password) {
    if (account_manager_js_1.account_manager.find_account(login)) {
        return { is_success: false, data: "Аккаунт с таким логином уже существует." };
    }
    else {
        if (account_manager_js_1.account_manager.add_account(login, password)) {
            return { is_success: true, data: "Аккаунт создан." };
        }
        else {
            return { is_success: false, data: "Ошибка создания." };
        }
    }
}
exports.create_account = create_account;
