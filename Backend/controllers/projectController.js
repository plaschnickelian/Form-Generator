const asyncHandler = require('express-async-handler')
const Project = require('../models/projectModel.js')
const ProjectType = require('../models/projectTypeModel.js')
const ProjectOfferType = require('../models/projectOfferTypeModel.js')
const { CError } = require('../middleware/error.js');
const { handleDBError } = require('../middleware/errorMiddleware.js')

const listProjectTypes = asyncHandler(async (req, res, next) => {

    ProjectType.find({}, function (err, ProjectTypes) {
        if (err) {
            throw new CError(404, "Fehler beim Laden der Projekttypen aus der Datenbank", "database");
        }
        res.json(ProjectTypes);
    })
})

const listProjects = asyncHandler(async (req, res, next) => {

    Project.find({}).populate('projectType')
        .exec(function (err, Projects) {
            if (err) {
                throw new CError(404, "Fehler beim Laden der Projekte aus der Datenbank", "database");
            }
            res.json(Projects);
        });
})

const listProjectOfferTypes = asyncHandler(async (req, res, next) => {
    ProjectOfferType.find({}, function (err, ProjectOfferTypes) {
        if (err)
            return done(err);
        res.json(ProjectOfferTypes)
    })
})

async function updateProjects(req, res, next) {
    let pID = { _id: req.params.id }
    let newProject = req.body.project
    const uniqueFields = {};

    if (newProject.projectID) {
        uniqueFields["projectID"] = newProject.projectID;
    }
    if (newProject.projectName) {
        uniqueFields["projectName"] = newProject.projectName;
    }
    if (newProject.projectNumber) {
        uniqueFields["projectNumber"] = newProject.projectNumber;
    }

    uniqueFields["_id"] = newProject._id;
    const valuesAlreadyInUse = await getUpdateConflicts(uniqueFields, Project);

    if (valuesAlreadyInUse.length > 0) {
        const errorStrings = {};

        valuesAlreadyInUse.forEach((conflictValue) => {
            switch (conflictValue) {
                case "projectID":
                    errorStrings["projectID"] = "Projekt-ID ist bereits vorhanden";
                    break;

                case "projectName":
                    errorStrings["projectName"] = "Projekt-Name ist bereits vorhanden";
                    break;

                case "projectNumber":
                    errorStrings["projectNumber"] = "Projekt-Nummer ist bereits vorhanden";
                    break;
            }
        })

        next(new CError(409, errorStrings, "already-exist"));
    }
    else {
        Project.updateOne(pID, { $set: newProject }, { returnOriginal: false })
            .then((doc) => res.status(200).send(doc))
            .catch((error) => {
                next(new CError(400, error.message, "default"));
            })
    }
};

async function deleteProjects(req, res, next) {
    let pID = req.params.id
    try {
        Project.findOneAndDelete({ _id: pID })
            .then((doc) => res.status(201).send(doc))
    } catch (error) {
        next(new CError(444, error.message, "default"))
    }
};

async function createProjects(req, res, next) {
    let newProject = req.body.project;
    const uniqueFields = (({ projectID, projectName, projectNumber }) => ({ projectID, projectName, projectNumber }))(newProject);

    const valuesAlreadyInUse = await checkConflicts(Object.entries(uniqueFields), Project);

    if (valuesAlreadyInUse.length > 0) {
        const errorStrings = {};

        valuesAlreadyInUse.forEach((conflictValue) => {
            switch (conflictValue) {
                case "projectID":
                    errorStrings["projectID"] = "Projekt ID ist bereits vorhanden";
                    break;

                case "projectName":
                    errorStrings["projectName"] = "Projektname ist bereits vorhanden";
                    break;

                case "projectNumber":
                    errorStrings["projectNumber"] = "Projektnummer ist bereits vorhanden"
            }
        })

        next(new CError(409, errorStrings, "already-exist"));
    }
    else {
        const project = new Project(newProject);
        try {
            project.save()
                .then((doc) => res.status(201).json(doc))
        } catch (error) {
            next(new CError(444, error.message, "default"));
        }

        Project.findOne({ projectName: newProject.projectName, projectNumber: newProject.projectNumber })
            .populate('projectOffer')
            .exec(function (err, proj) {
            });
        Project.findOne({ projectName: newProject.projectName, projectNumber: newProject.projectNumber })
            .populate('projectData')
            .exec(function (err, proj) {
            });
    }
}


async function createProjectOfferType(req, res, next) {
    let newProjectOfferType = req.body.offerType;

    //find if documents with identical name already exist
    const offerTypeNameExists = await ProjectOfferType.findOne({ projectOfferType: newProjectOfferType.projectOfferType }).exec();
    const offerTypeIDExists = await ProjectOfferType.findOne({ projectOfferTypeID: newProjectOfferType.projectOfferTypeID }).exec();

    if (offerTypeNameExists || offerTypeIDExists) //if they already exist
    {
        const errors = {};

        if (offerTypeNameExists) {
            errors["projectOfferType"] = "Name ist bereits vorhanden";
        }

        if (offerTypeIDExists) {
            errors["projectOfferTypeID"] = "ID ist bereits vorhanden";
        }

        next(new CError(409, errors, "already-exist"));
    }
    else {
        const projectOfferTypeObj = new ProjectOfferType({
            "projectOfferTypeID": newProjectOfferType.projectOfferTypeID,
            "projectOfferType": newProjectOfferType.projectOfferType,
            "isActive": newProjectOfferType.isActive
        });
        projectOfferTypeObj.save()
            .then((doc) => res.status(201).send(doc))
            .then((doc) => console.log(doc))
            .catch((error) => {
                next(new CError(400, "Fehler beim speichern", "default"));
            });
    }
}

async function deleteProjectsOfferType(req, res) {
    let pID = req.params.id
    try {
        ProjectOfferType.findOneAndDelete({ projectOfferTypeID: pID })
            .then((doc) => res.status(200).send(doc))
    } catch (error) {
        handleDBError(error, res)
    }
};

async function updateProjectsOfferType(req, res, next) {
    let pID = { _id: req.params.id }
    let projectOfferTypeValues = req.body.offertype;
    const uniqueFields = {};

    if (projectOfferTypeValues.projectOfferType) {
        uniqueFields["projectOfferType"] = projectOfferTypeValues.projectOfferType;
    }
    if (projectOfferTypeValues.projectOfferTypeID) {
        uniqueFields["projectOfferTypeID"] = projectOfferTypeValues.projectOfferTypeID;
    }

    uniqueFields["_id"] = projectOfferTypeValues._id;
    const valuesAlreadyInUse = await getUpdateConflicts(uniqueFields, ProjectOfferType);

    if (valuesAlreadyInUse.length > 0) {
        // Key: Frontend newErrors attribute, Value: Error String
        const errorStrings = {};

        valuesAlreadyInUse.forEach((conflictValue) => {
            switch (conflictValue) {
                case "projectOfferType":
                    errorStrings["offerTypeName"] = "Name ist bereits vorhanden";
                    break;

                case "projectOfferTypeID":
                    errorStrings["offerTypeID"] = "ID ist bereits vorhanden";
                    break;
            }
        })

        next(new CError(409, errorStrings, "already-exist"));
    }
    else {
        ProjectOfferType.updateOne(pID, { $set: projectOfferTypeValues }, { returnOriginal: false })
            .then((doc) => res.status(201).send(doc))
            .catch((error) => {
                next(new CError(400, "Fehler beim update", "default"));
            })
    }
};

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

module.exports = { listProjectTypes, listProjects, listProjectOfferTypes, updateProjects, deleteProjects, createProjects, createProjectOfferType, deleteProjectsOfferType, updateProjectsOfferType }