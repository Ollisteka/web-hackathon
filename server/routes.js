const Student = require("./models/student");
const rootDir = process.cwd();
const path = require('path');

module.exports = (app, sessionStorage, teachersStorage, studentStorage, studentIdGenerator, sidGenerator) => {
    app.get('/', (req, res) => {

        res.sendStatus(200);
    });

    app.get('/login', (req, res) => {
        res.sendFile(path.join(rootDir, '../views/login.html'));
    });

    app.post('/login', (req, res) => {
        console.log(req.body);

        const body = req.body || {};

        const {sid} = req.cookies || {};
        if (sid) {
            res.sendStatus(409);
            return;
        }
        const userType = (body).userType;
        if (userType === "teacher") {
            const {login, password} = body;

            const {isAuthenticated, teacher} = teachersStorage.authenticate(login, password);
            if (isAuthenticated) {
                const newSid = sidGenerator();
                sessionStorage.add(newSid, {id: teacher.id, isTeacher: true});
                res.cookie("sid", newSid);
                res.redirect(302, '/createMeeting');
                return;
            }
        }

        if (userType === "student") {
            const {name} = body;
            const id = studentIdGenerator();
            const newSid = sidGenerator;
            studentStorage.add(new Student(id, name || id.toString()));
            sessionStorage.add(newSid, id);
            res.cookie("sid", newSid);
            res.redirect(302, '/question');
            return;
        }

        res.sendStatus(401)
    });

    app.get('/createMeeting', (req, res) => {
        // todo проверить куку учителя
        res.sendFile(path.join(rootDir, '../views/createMeeting.html'));
    });

    app.post('/createMeeting', (req, res) => {
        // todo проверить куку учителя, save data
        res.redirect(302, '/question');
    });

    app.get('/question', (req, res) => {
        res.sendFile(path.join(rootDir, '../views/question.html'));
    });
};
