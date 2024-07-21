const asyncHandler = require('express-async-handler')
//DWBO sources
const User = require('../models/userModel.js')
const { CError } = require('../middleware/error.js');

const listUsers = asyncHandler(async (req, res, next) => {
    let mail = '';

    if (req.params.mail) {
        mail = decodeURIComponent(req.params.mail);

        User.findOne({ userMail: mail }, '_id userFirstName userLastName userMail isAdministrator isActive')
            .populate('userProject', 'projectID projectName projectNumber')
            .exec(function (err, rUsers) {
                if (err) {
                    next(new CError(400, "Fehler", "invalid-params"));
                }
                else if (!rUsers) {
                    next(new CError(404, "Es wurde kein Beuntzer mit dieser E-Mail gefunden.", "not-found"))
                }
                else {
                    res.status(200).json(rUsers);
                }
            });
    } else {
        //get all users with project data
        User.find({}, '_id userFirstName userLastName userMail isAdministrator isActive').
            populate('userProject', 'projectID projectName projectNumber').
            exec(function (err, rUsers) {
                if (err) {
                    throw new CError(404, "Fehler beim Laden der Benutzer!", "not-found");
                }
                res.status(200).json(rUsers);
            });
    }
})

const getUser = asyncHandler(async (req, res, next) => {
    if (!req.params.id) {
        throw new CError(400, "Benutzeridentifikation ist nicht angegeben!", "invalid-params");
    }
    const mail = req.params.id;

    User.findOne({ userMail: { mail } }).populate('userProject').
        exec(function (err, rUsers) {
            if (err) {
                throw new CError(400, err, "invalid-params");
            }
            res.json(rUsers);
        });
})

async function updateUsers(req, res, next) {
    let uID = { _id: req.params.id }
    let newUser = req.body.user;
    let valuesAlreadyInUse = [];

    if (!uID._id || !newUser) {
        next(new CError(400, "Keine ID oder User angegeben", "invalid-params"));
    }
    else {
        if ("userMail" in newUser) {
            const uniqueFields = { _id: uID._id, userMail: newUser.userMail };

            valuesAlreadyInUse = await getUpdateConflicts(uniqueFields, User);
        }

        if (valuesAlreadyInUse.length > 0) {
            const errorStrings = {};

            valuesAlreadyInUse.forEach((conflictValue) => {
                switch (conflictValue) {
                    case "userMail":
                        errorStrings["userMail"] = "Diese E-Mail ist bereits vorhanden";
                        break;
                }
            })

            next(new CError(409, errorStrings, "already-exist"));
        }
        else {
            try {
                User.findOne(uID).select("+userPassword").exec(async function (err, user) {
                    if (err) {
                        next(new CError(400, err, "invalid-params"));
                    }
                    else if (!user) {
                        next(new CError(400, "Kein User gefunden", "invalid-params"));
                    }
                    else {
                        if ("userPassword" in newUser && newUser.userPassword !== user.userPassword && !(await user.matchPassword(newUser.userPassword))) {
                            next(new CError(401, "Es ist nicht erlaubt das Passwort auf diese Weise zu ändern", "authorization-failed"));
                        }
                        else {
                            User.findOneAndUpdate(uID, { $set: newUser }, { returnOriginal: false, select: "_id userFirstName userLastName userMail isAdministrator isActive userProject" }, async function (err, user) {
                                if (err) {
                                    next(new CError(400, err, "invalid-params"));
                                }
                                else {
                                    res.status(200).send(user);
                                }
                            });
                        }
                    }
                })
            } catch (error) {
                next(new CError(400, error.message, "default"));
            }
        }
    }
};

async function deleteUsers(req, res, next) {
    let uID = req.params.id
    try {
        User.findOneAndDelete({ _id: uID })
            .then((doc) => res.status(200).send(doc))
    } catch (error) {
        next(400, error.message, "default");
    }
};

async function createUsers(req, res, next) {
    if (!req.body.user || Object.keys(req.body.user)?.length === 0) {
        next(new CError(400, "Kein Benutzer im Body", "invalid-params"));
    }
    else {
        let newUser = req.body.user;

        const mailExists = await User.find({ userMail: newUser.userMail }).count();

        if (mailExists > 0) {
            next(new CError(409, { "userMail": `Der Benutzer mit der E-Mail Adresse: ${newUser.userMail} existiert bereits.` }, "already-exist"));
        } else {
            const user = new User({
                "userFirstName": newUser.userFirstName,
                "userLastName": newUser.userLastName,
                "userMail": newUser.userMail,
                "userPassword": newUser.userPassword,
                "isActive": newUser.isActive,
                "isAdministrator": newUser.isAdministrator,
                "userProject": newUser.userProject
            });

            try {
                user.save()
                    .then((doc) => {
                        res.status(201).send(doc);
                    })
                    .catch((err) => {
                        next(new CError(400, "Fehlende Parameter", "invalid-params"));
                    })
            } catch (error) {
                next(new CError(409, error, "default"));
            }

            User.findOne({ userMail: newUser.userMail })
                .populate('userProject')
                .exec(function (err, proj) {
                });
        }
    }
}

async function getUpdateConflicts(newObject, schema) {
    const currentObject = await schema.findOne({ _id: newObject._id }).exec();
    let differentKeys = [];

    Object.entries(newObject).forEach((entry) => {
        console.log(newObject)
        if (currentObject[entry[0]] != entry[1]) {
            differentKeys.push(entry);
        }
    });

    const valuesAlreadyInUse = checkConflicts(differentKeys, schema);

    return valuesAlreadyInUse;
}

async function checkConflicts(uniqueFields, schema) {
    const valuesAlreadyInUse = []

    for (const entry of uniqueFields) {
        let checkAttribute = {};
        checkAttribute[entry[0]] = entry[1];
        let foundObject = await schema.findOne(checkAttribute).exec();

        if (foundObject) {
            valuesAlreadyInUse.push(entry[0]);
        }
    }

    return valuesAlreadyInUse;
}

module.exports = { listUsers, updateUsers, deleteUsers, createUsers, getUser }