import { Request, Response } from "express";
import { account_manager } from "../data_management/account_manager";
import { Session, SessionData } from "express-session";

function check_authorization_valid(request: Request, response: Response, callback_function: (page_session: any) => void): void {
    const page_session = request.session;
    if (page_session.authorization) {
        if (account_manager.get_private_account_data(page_session.authorization.login, page_session.authorization.password)) {
            callback_function(page_session);
        } else {
            response.status(200).send(JSON.stringify({is_success: false, data: "Неправельный логин или пороль."}));
        }
    } else {
        response.status(200).send(JSON.stringify({is_success: false, data: "Не авторизован."}));
    }
}

export { check_authorization_valid };