module.exports = class TeachersStorage {
    constructor() {
        this.map = new Map();
    }

    authenticate(login, inputPassword){
        if (this.map.has(login)){
            const {password, teacher} = this.map.get(login);
            if(password === inputPassword){
                return {isAuthenticated: true, teacher}
            }
        }

        return {isAuthenticated: false};
    }

    getTeacher(login){
        return (this.map.get(login) || {}).teacher;
    }

    add(login, password, teacher){
        this.map.set(login, {password, teacher});
    }
}
