const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes = require("./routes");
const SessionStorage = require("./storages/sessionStorage");
const StudentStorage = require("./storages/studentStorage");
const TeacherStorage = require("./storages/teachersStorage");
const SurveyStateStorage = require("./storages/surveyStateStorage");
const SurveyStorage = require("./storages/surveyStorage");
const QuestionStorage = require("./storages/surveyStorage");
const Teacher = require("./models/teacher");
const Survey = require("./models/survey");
const Question = require("./models/question");
const SurveyState = require("./models/surveyState");
const uuid = require("uuid/v4");
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/static', express.static('../static'));
const sessionStorage = new SessionStorage();
const teachersStorage = new TeacherStorage();
teachersStorage.add("admin", "asdmin", new Teacher("admin"));
const studentStorage = new StudentStorage();
const question1 = new Question("sup?", ["not much", "damn"], 0);
const questionsStorage = new QuestionStorage();
questionsStorage.add("0", question1);
const survey = new Survey("test", ["0"]);
const surveyStorage = new SurveyStorage();
surveyStorage.add("0", survey);
const surveyStateStorage = new SurveyStateStorage();
surveyStateStorage.add("0", new SurveyState(survey, "admin"));
const storages = {
    surveyStateStorage,
    sessionStorage,
    teachersStorage,
    studentStorage,
    questionsStorage,
    surveyStorage
};
routes(app, storages, uuid, uuid);

app.listen(3000);
