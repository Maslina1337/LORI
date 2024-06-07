import { account_manager } from "../data_management/account_manager.js";

function enter_account(login: string, password: string): {is_success: boolean, data: string} {
    let private_account_data = account_manager.get_private_account_data(login, password);
    if (private_account_data) {
        return {is_success: true, data: "Успешная авторизация"};
    } else {
        return {is_success: false, data: "Неверные данные"};
    }
}

export { enter_account };