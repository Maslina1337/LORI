class loginSockets {
    loginSocketsObject: {[key: string]: Array<string>};

    constructor() {
        this.loginSocketsObject = {};
    }

    getSockets(login: string): Array<string> {
        return this.loginSocketsObject[login];
    }

    addSocket(login: string, socket_id: string): void {
        this.loginSocketsObject[login].push(socket_id);
    }

    addLogins(logins: Array<string>): void {
        this.loginSocketsObject = {};
        logins.forEach((element) => {
            this.loginSocketsObject[element] = [];
        });
    }

    addLogin(login: string): void {
        this.loginSocketsObject[login] = [];
    }

    deleteSocket(login: string, socket_id: string): void {
        const splice_index = this.loginSocketsObject[login].indexOf(socket_id);
        if (splice_index > -1) {
            this.loginSocketsObject[login].splice(splice_index, 1);
        }
    }
}

const login_sockets = new loginSockets();

export { login_sockets };