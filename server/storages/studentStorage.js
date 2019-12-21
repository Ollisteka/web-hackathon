module.exports = class StudentStorage {
    constructor() {
        this.map = new Map();
    }

    getById(id){
        return map.get(id);
    }

    add(user){
        this.map.set(user.id, user);
    }
}
