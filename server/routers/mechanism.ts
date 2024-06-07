import express from "express";
import { create_account } from "../mechanism_exports/create_account.js";
import { enter_account } from "../mechanism_exports/enter_account.js";
import { exit_account } from "../mechanism_exports/exit_account.js";
import { Account, account_manager } from "../data_management/account_manager.js";
import { public_server_values } from "../data_management/public_server_values.js";
import { login_password_valid_check } from "../mechanism_exports/login_password_valid_check.js";
import { check_authorization_valid } from "../mechanism_exports/check_authorization_valid.js";
import { cache } from "../mechanism_exports/create_search_cache.js";
import path from "path";

const router = express.Router();

router.get("/get_public_server_values", (request, response) => {
    response.json(public_server_values);
});

router.post("/create_account", (request, response) => {
    const page_session = request.session;
    console.log(request.body);
    let valid_status = login_password_valid_check(request.body.login, request.body.password);
    if (valid_status.is_valid) {
        let creation_status = create_account(request.body.login, request.body.password);
        if (creation_status.is_success) {
            page_session.authorization = {login: request.body.login, password: request.body.password};
            response.status(200).send({is_success: true, data: creation_status.data});
        } else {
            response.status(200).send({is_success: false, data: creation_status.data});
        }
    } else {
        response.status(200).send({is_success: false, data: valid_status.message});
    }
});

router.post("/enter_account", (request, response) => {
    const page_session = request.session;

    let enter_status = enter_account(request.body.login, request.body.password);

    if (enter_status.is_success) {
        page_session.authorization = {login: request.body.login, password: request.body.password};
        response.status(200).send({is_success: true, data: enter_status.data});
    } else {
        response.status(200).send({is_success: false, data: enter_status.data});
    }
});

router.get("/get_private_account_data", (request, response) => {
    const page_session = request.session;
    if (page_session.authorization) {
        const private_account_data = account_manager.get_private_account_data(page_session.authorization.login, page_session.authorization.password);
        response.status(200).send({is_success: true, data: private_account_data});
    } else {
        response.status(200).send({is_success: false, data: "Not authorized."});
    }
});

router.post("/get_public_account_data", (request, response) => {
    const public_account_data = account_manager.get_public_account_data(request.body.login);
    if (public_account_data) {
        response.status(200).send({is_success: true, data: public_account_data});
    } else {
        response.status(200).send({is_success: false, data: public_account_data});
    }
});

router.get("/exit_account", (request, response) => {
    const page_session = request.session;
    if (page_session.authorization) {
        exit_account(page_session);
        response.status(200).send({is_success: true, data: "Успешный выход"});
    } else {
        response.status(200).send({is_success: false, data: "Not authorized."});
    }
});

router.put("/update_account_data", (request, response) => {
    check_authorization_valid(request, response, (page_session) => {
        // Обновление данных аккаунта
        const is_updated = account_manager.simple_update_account(
            page_session.authorization.login,
            request.body.nickname,
            request.body.login,
            request.body.password,
            request.body.about
        );

        if (is_updated.is_success) {
            page_session.authorization.login = request.body.login;
            page_session.authorization.password = request.body.password;
            response.status(200).send({is_success: true, data: is_updated.data});
        } else {
            response.status(200).send({is_success: false, data: is_updated.data});
        }
    })
});

router.post("/update_account_avatar", (request, response) => {
    check_authorization_valid(request, response, (page_session) => {
        if (request.files) {
            // Обновление данных аккаунта
            const is_updated = account_manager.simple_update_avatar(
                page_session.authorization.login,
                request.files.file,
            );

            response.status(200).send({is_success: is_updated.is_success, data: is_updated.data});
        } else {
            response.status(200).send({is_success: false, data: "Нет файла."});
        }
    })
});

router.get("/get_user_avatar/:login", (request, response) => {
    const login = String(request.params.login);
    console.log("IM HERE", login, account_manager.find_account(login));
    let account = account_manager.find_account(login);
    if (account) {
        const avatar = account.avatar;
        if (avatar) {
            response.status(200).sendFile(path.join(__dirname, "../data_management/account_avatar_library/", avatar));
        } else {
            response.status(200).sendFile(path.join(__dirname, "../data_management/account_avatar_library/default/default_avatar.jpg"));
        }
    } else {
        response.status(404).send("fail");
    }
})

router.get("/titikaka", (req, res) => {
    const page_session = req.session;
    console.log("AUTH: ", page_session.authorization_data);
    res.status(200).send(JSON.stringify("hello"));
})

export { router };