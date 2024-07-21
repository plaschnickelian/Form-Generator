const { CError } = require('../middleware/error.js')

async function listAllObjects(req, res, next) {
    const user = req.user;
    const Model = req.model;
    if (!Model) {
        return next(new CError(400, "no user project type", "invalid-params"));
    }

    const found = Model.find({ project: user.userProject }).lean();

    found.exec(function (err, object) {
        if (err) {
            next(CError(400, err.message, "default"));
        }
        else {
            res.send(object);
        }
    })
}

async function getAllObjects(req, res, next) {
    const user = req.user;
    const Model = req.model;
    if (!Model) {
        return next(new CError(400, "no user project type", "invalid-params"));
    }

    const found = Model.find({ project: user.userProject }).lean();

    found.exec(function (err, object) {
        if (err) {
            next(CError(400, err.message, "default"));
        }
        else {
            res.send(object);
        }
    })
}

async function getObject(req, res, next) {
    if (!req.params.id) {
        next(new CError(400, 'no ID in Header', "invalid-params"));
    }
    else {
        cID = { _id: req.params.id };

        const Model = req.model;
        if (!Model) {
            return next(new CError(400, "no Model", "invalid-params"));
        }

        Model.findOne({ _id: cID }).exec(function (err, object) {
            if (err) {
                next(new CError(400, err.message, "default"))
            }
            else if (!object) {
                next(new CError(404, "No Client found", "not-found"))
            }
            else {
                res.status(200).send(JSON.stringify(object));
            }
        })
    }
}

async function updateObject(req, res, next) {
    let cID = { _id: req.params.id }
    let newObject = req.body.objects.object

    const Model = req.model;
    if(!Model) {
        return next(new CError(400, "no user project type", "invalid-params"));
    }

    try {
        Model.updateOne(cID, { $set: newObject }, {
            returnOriginal: false
        })
            .then((doc) => res.status(200).send(doc))
    } catch (error) {
        next(new CError(400, error.message, "default"));
    }
}

async function deleteObject(req, res, next) {
    let cID = req.params.id

    const Model = req.model;
    if(!Model) {
        return next(new CError(400, "no user project type", "invalid-params"));
    }

    try {
        Model.findOneAndDelete({ _id: cID })
            .then((doc) => res.status(204).send(doc))
    } catch (error) {
        next(new CError(400, error.message, "default"));
    }
};

async function createObject(req, res, next) {
    let newObject = req.body.objects.object;

    const Model = req.model;
    if(!Model) {
        return next(new CError(400, "no Model", "invalid-params"));
    }

    const object = new Model(newObject);

    try {
        object.save()
            .then((doc) => res.status(201).send(doc))
    } catch (error) {
        next(new CError(400, error.message, "default"));
    }
}

module.exports = {
    getObject,
    getAllObjects,
    listAllObjects,
    updateObject,
    deleteObject,
    createObject,
}