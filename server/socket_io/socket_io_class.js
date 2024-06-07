"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.socket_io = void 0;
const socket_io_1 = require("socket.io");
const account_manager_1 = require("../data_management/account_manager");
const login_sockets_1 = require("../data_management/login_sockets");
const login_sockets_dates_1 = require("../data_management/login_sockets_dates");
class SocketIO {
    constructor() {
        this.io;
    }
    initSocketIO(server) {
        this.io = new socket_io_1.Server(server);
    }
    getSocketIO() {
        return this.io;
    }
    checkEventsSocketIO() {
        this.io.on('connection', (socket) => {
            let page_req = socket.request; // Получение сеанса
            let socket_id = socket.id;
            let current_socket_login = null;
            if (page_req.session.authorization) {
                if (account_manager_1.account_manager.get_private_account_data(page_req.session.authorization.login, page_req.session.authorization.password)) {
                    current_socket_login = page_req.session.authorization.login;
                    if (current_socket_login) {
                        login_sockets_1.login_sockets.addSocket(current_socket_login, socket_id);
                    }
                }
            }
            page_req.session.save();
            console.log("user connected " + socket_id);
            socket.on('disconnect', () => {
                page_req.session.reload(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    if (current_socket_login !== null) {
                        //Обновляем дату последнего прибывания пользователя на сайте.
                        login_sockets_dates_1.login_sockets_dates.updateDate(current_socket_login);
                        //Отвязываем сокет от логина
                        login_sockets_1.login_sockets.deleteSocket(current_socket_login, socket_id);
                    }
                    // Сохраняем сессию
                    page_req.session.save();
                });
                console.log("user disconnected " + socket_id);
            });
        });
    }
}
const socket_io = new SocketIO();
exports.socket_io = socket_io;
