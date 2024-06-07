import { Server } from "socket.io";

import { account_manager } from "../data_management/account_manager";
import { login_sockets } from "../data_management/login_sockets";
import { login_sockets_dates } from "../data_management/login_sockets_dates";

class SocketIO {
    io: any;

    constructor() {
        this.io;
    }

    initSocketIO(server:any) {
        this.io = new Server(server);
    }

    getSocketIO() {
        return this.io
    }

    checkEventsSocketIO() {
        this.io.on('connection', (socket:any) => {
            let page_req = socket.request; // Получение сеанса
        
            let socket_id = socket.id;
        
            let current_socket_login = null; 
            if (page_req.session.authorization) {
                if (account_manager.get_private_account_data(page_req.session.authorization.login, page_req.session.authorization.password)) {
                    current_socket_login = page_req.session.authorization.login;
                    if (current_socket_login) {
                        login_sockets.addSocket(current_socket_login, socket_id);
                    }
                }
            }
        
            page_req.session.save();
        
            console.log("user connected " + socket_id);
            
            socket.on('disconnect', () => {
                page_req.session.reload(function(err:any) {
                    if (err) {
                        console.log(err);
                    }
                
                    if (current_socket_login !== null) {
                        //Обновляем дату последнего прибывания пользователя на сайте.
                        login_sockets_dates.updateDate(current_socket_login);

                        //Отвязываем сокет от логина
                        login_sockets.deleteSocket(current_socket_login, socket_id);
                    }
                    
                    // Сохраняем сессию
                    page_req.session.save();
                })
        
                console.log("user disconnected " + socket_id);
            })
        })
    }
}

const socket_io = new SocketIO();

export { socket_io };