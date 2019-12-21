module.exports = class QuestionsStorage {
    constructor() {
        this.map = new Map();
    }

    add(id, question){
        this.map.set(id, question);
    }

    get(id){
        return this.map.get(id);
    }
};
