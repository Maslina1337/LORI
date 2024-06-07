class loginSocketsDates {
    loginDates: {[key: string]: Date | null};

    constructor() {
        this.loginDates = {};
    }

    getDate(login: string): Date | null {
        return this.loginDates[login];
    }

    updateDate(login: string): void {
        this.loginDates[login] = new Date();
    }

    addLogins(logins: Array<string>): void {
        logins.forEach((element) => {
            this.loginDates[element] = null;
        });
    }

    addLogin(login: string): void {
        this.loginDates[login] = null;
    }

    getAllLoginSocketDates(): {[key: string]: Date | null} {
        return this.loginDates;
    }
}

const login_sockets_dates = new loginSocketsDates();

export { login_sockets_dates };