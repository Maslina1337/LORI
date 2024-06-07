import { account_manager } from "../data_management/account_manager.js";

function create_account(login: string, password: string): {is_success: boolean, data: string} {
    if (account_manager.find_account(login)) {
        return {is_success: false, data: "Аккаунт с таким логином уже существует."};
    } else {
        if (account_manager.add_account(login, password)) {
            return {is_success: true, data: "Аккаунт создан."};
        } else {
            return {is_success: false, data: "Ошибка создания."};
        }
    }
}

export { create_account };