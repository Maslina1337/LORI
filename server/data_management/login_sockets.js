"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login_sockets = void 0;
class loginSockets {
    constructor() {
        this.loginSocketsObject = {};
    }
    getSockets(login) {
        return this.loginSocketsObject[login];
    }
    addSocket(login, socket_id) {
        this.loginSocketsObject[login].push(socket_id);
    }
    addLogins(logins) {
        this.loginSocketsObject = {};
        logins.forEach((element) => {
            this.loginSocketsObject[element] = [];
        });
    }
    addLogin(login) {
        this.loginSocketsObject[login] = [];
    }
    deleteSocket(login, socket_id) {
        const splice_index = this.loginSocketsObject[login].indexOf(socket_id);
        if (splice_index > -1) {
            this.loginSocketsObject[login].splice(splice_index, 1);
        }
    }
}
const login_sockets = new loginSockets();
exports.login_sockets = login_sockets;
