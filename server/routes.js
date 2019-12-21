const Student = require("./models/student");
const rootDir = process.cwd();
const path = require('path');

module.exports = (app, storages, studentIdGenerator, sidGenerator) => {
    const {surveyStateStorage, sessionStorage, teachersStorage, studentStorage, questionsStorage} = storages;
    app.get('/', (req, res) => {

        res.sendStatus(200);
    });

    app.get('/login', (req, res) => {
        res.sendFile(path.join(rootDir, '../views/login.html'));
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
                res.redirect(302, '/createMeeting');
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
        res.redirect('/question');
    });

    // app.get('/question', (req, res) => {
    //     res.sendFile(path.join(rootDir, '../views/question.html'));
    // });
    app.get('/survey/:id', (req, res) =>
    {
        const {id} = req.params;

        const surveyState = surveyStateStorage.get(id);
        if (!surveyState) {
            res.sendStatus(404);
            return;
        }

        res.redirect(302, `/survey/${id}/question/0`);
    });

    app.get('/survey/:id/question/:index', (req, res) => {
        let {id, index} = req.params;
        const surveyState = surveyStateStorage.get(id);
        if (!surveyState) {
            res.sendStatus(404); //redirect????
            return;
        }

        index = parseInt(index);

        if (surveyState.currentQuestionIndex === surveyState.survey.questions.length){
            res.redirect("/surveyended");
            return;
        }

        if (index !== surveyState.currentQuestionIndex){
            res.redirect(`/survey/${id}/question/${surveyState.currentQuestionIndex}`);
            return;
        }

        res.json(questionsStorage.get(surveyState.questions[index]));
    });

    app.post('/survey/:id/question/:index', (req, res) =>{
        const {sid} = req.cookies;
        const {ids: id, isTeacher} = sessionStorage.get(sid);

        if (isTeacher){
            res.sendStatus(403);
            return;
        }

        const {index} = req.params;
        let surveyId = req.params.id;
        const surveyState = surveyStateStorage.get(surveyId);
        if (!surveyState) {
            res.sendStatus(404); //redirect????
            return;
        }

        if (!surveyState.hasStudentRegistered(id)){
            res.sendStatus(403);
            return;
        }

        if (index !== surveyState.currentQuestionIndex){
            res.redirect(`/survey/${id}/question/${surveyState.currentQuestionIndex}`);
            return;
        }


        surveyState.vote(id, index)
    });
};
