module.exports = class SurveyStateStorage {
    constructor() {
        this.map = new Map();
    }

    add(id, surveyState){
        this.map.set(id, surveyState);
    }

    get(id){
        return this.map.get(id);
    }
};
