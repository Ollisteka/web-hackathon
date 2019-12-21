module.exports = class SurveyStorage {
    constructor() {
        this.map = new Map();
    }

    add(id, survey){
        this.map.set(id, survey);
    }

    get(id){
        return this.map.get(id);
    }
};
