module.exports = class SessionStorage {
    // map: sid -> {id, isTeacher}
    constructor() {
        this.map = new Map();
    }

    contains(sid){
        return this.map.has(sid);
    }

    get(sid){
        return this.map.get(sid);
    }

    add(sid, user){
        this.map.set(sid, user);
    }
}
