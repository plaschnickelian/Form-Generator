const { CError } = require("../middleware/error");

async function getFormPageObject(req, res, next) {
    if (!req.params.id) {
        next(new CError(400, 'no ID in Header', "default"));
    }
    else {
        cID = { _id: req.params.id };

        const Model = req.model;
        if (!Model) {
            return next(new CError(400, "no Model", "invalid-params"));
        }

        Model.findOne({ project: cID }).exec(function (err, object) {
            if (err) {
                next(new CError(400, err.message, "default"))
            }
            else if (!object) {
                next(new CError(404, "No Object found", "not-found"))
            }
            else {
                res.status(200).send(object);
            }
        })
    }
}

async function updateFormPageObject(req, res, next) {
    const user = req.user;
    const newProject = req.body.project;

    if (!newProject) {
        next(new CError(400, "Kein Projekt im Body", "invalid-params"));
    }
    else {
        Project.findOneAndUpdate({ _id: user.userProject }, newProject, { returnOriginal: false })
            .then((object) => {
                if (!object) {
                    next(404, "Kein Projekt gefunden", "not-found");
                }
                else {
                    res.status(200).send(object);
                }
            })
            .catch((err) => {
                next(400, err, "invalid-params")
            })
    }
}

module.exports = {
    getFormPageObject,
    updateFormPageObject
}