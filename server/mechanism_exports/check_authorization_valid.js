"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.check_authorization_valid = void 0;
const account_manager_1 = require("../data_management/account_manager");
function check_authorization_valid(request, response, callback_function) {
    const page_session = request.session;
    if (page_session.authorization) {
        if (account_manager_1.account_manager.get_private_account_data(page_session.authorization.login, page_session.authorization.password)) {
            callback_function(page_session);
        }
        else {
            response.status(200).send(JSON.stringify({ is_success: false, data: "Неправельный логин или пороль." }));
        }
    }
    else {
        response.status(200).send(JSON.stringify({ is_success: false, data: "Не авторизован." }));
    }
}
exports.check_authorization_valid = check_authorization_valid;
