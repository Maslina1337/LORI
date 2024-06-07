"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.enter_account = void 0;
const account_manager_js_1 = require("../data_management/account_manager.js");
function enter_account(login, password) {
    let private_account_data = account_manager_js_1.account_manager.get_private_account_data(login, password);
    if (private_account_data) {
        return { is_success: true, data: "Успешная авторизация" };
    }
    else {
        return { is_success: false, data: "Неверные данные" };
    }
}
exports.enter_account = enter_account;
