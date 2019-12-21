const express = require("express");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const routes =  require("./routes");
const SessionStorage = require("./storages/sessionStorage");
const StudentStorage = require("./storages/studentStorage");
const TeacherStorage = require("./storages/teachersStorage");
const Teacher = require("./models/teacher");
const uuid = require("uuid/v4");
const app = express();
const path = require('path');

const port = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/static', express.static(path.join(process.cwd(), "../static")));
const sessionStorage = new SessionStorage();
const teacherStorage = new TeacherStorage();
teacherStorage.add("admin", "asdmin", new Teacher("admin"));
const studentStorage = new StudentStorage();
routes(app, sessionStorage, teacherStorage, studentStorage, uuid, uuid);

app.listen(port);
