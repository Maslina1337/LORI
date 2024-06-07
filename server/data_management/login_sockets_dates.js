"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.login_sockets_dates = void 0;
class loginSocketsDates {
    constructor() {
        this.loginDates = {};
    }
    getDate(login) {
        return this.loginDates[login];
    }
    updateDate(login) {
        this.loginDates[login] = new Date();
    }
    addLogins(logins) {
        logins.forEach((element) => {
            this.loginDates[element] = null;
        });
    }
    addLogin(login) {
        this.loginDates[login] = null;
    }
    getAllLoginSocketDates() {
        return this.loginDates;
    }
}
const login_sockets_dates = new loginSocketsDates();
exports.login_sockets_dates = login_sockets_dates;
