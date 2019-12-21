module.exports = class SurveyState {
    constructor(survey, teacher) {
        this.survey = survey;
        this.currentQuestionIndex = 0;
        this.teacher = teacher;
        this.studentsAnswers = new Map();
    }

    hasStudentRegistered(studentId){
        return this.studentsAnswers.has(studentId);
    }

    addStudent(studentId){
        return this.studentsAnswers.set(studentId, new Map());
    }

    vote(studentId, questionId, answerIndex) {
        if (this.survey.questions[this.currentQuestionIndex] !== questionId) {
            return false;
        }


        let answersOfThisStudent = this.studentsAnswers.get(studentId);
        answersOfThisStudent.set(questionId, answerIndex);
        return true;
    }

    moveToNextQuestion(){
        if (this.currentQuestionIndex === this.survey.questions.length - 1){
            return false;
        }

        this.currentQuestionIndex++;
        return true;
    }
};
