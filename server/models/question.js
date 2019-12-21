module.exports = class Question {
  constructor(questionText, answersText, rightAnswerIndex) {
      this.questionText = questionText;
      this.answersText = answersText;
      this.rightAnswerIndex = rightAnswerIndex;
  }
};
