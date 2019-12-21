const Student = require("./models/student");

module.exports = (app, storages, studentIdGenerator, sidGenerator) => {
    const {surveyStateStorage, sessionStorage, teachersStorage, studentStorage} = storages;
    app.get('/', (req, res) => {

        res.sendStatus(200);
    });

    app.post('/login', (req, res) => {
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
                res.sendStatus(200);
                return;
            }
        }

        if (userType === "student") {
            const {name, survey} = body;
            const id = studentIdGenerator();
            const accessedSurvey = surveyStateStorage.get(survey);
            if (!accessedSurvey){
                res.sendStatus(404);
                return;
            }
            accessedSurvey.addStudent(id);
            const newSid = sidGenerator;
            studentStorage.add(new Student(id, name || id.toString()));
            sessionStorage.add(newSid, id);
            res.cookie("sid", newSid);
            res.sendStatus(200);
            return;
        }

        res.sendStatus(401)
    });
    app.get('/survey/:id', (req, res) =>
    {
        const {id} = req.params;

        const surveyState = surveyStateStorage.get(id);
        if (!surveyState) {
            res.sendStatus(404);
            return;
        }

        res.redirect(`/survey/${id}/question/0`);
    });

    app.get('/survey/:id/question/:index', (req, res) => {
        const {id, index} = req.params;
        const surveyState = surveyStateStorage.get(id);
        if (!surveyState) {
            res.sendStatus(404);
            return;
        }
    })
};
