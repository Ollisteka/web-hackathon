module.exports = class StudentStorage {
    constructor() {
        this.map = new Map();
    }

    get(id){
        return this.map.get(id);
    }

    add(user){
        this.map.set(user.id, user);
    }
}
