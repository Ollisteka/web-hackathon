const Student = require("./models/student");

module.exports = (app, sessionStorage, teachersStorage, studentStorage, studentIdGenerator, sidGenerator) => {
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
            const {name} = body;
            const id = studentIdGenerator();
            const newSid = sidGenerator;
            studentStorage.add(new Student(id, name || id.toString()));
            sessionStorage.add(newSid, id);
        }

        res.sendStatus(401)
    });
};
