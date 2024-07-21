const { mongoose } = require('mongoose')

//Mongodb collection generieren (sql table)
const projectSchema = new mongoose.Schema({
    projectID: {
        type: Number,
        required: true,
        unique: true
    },
    projectName: {
        type: String,
        required: true
    },
    adminDescription: {
        type: String
    },
    userDescription: {
        type: String
    },
    projectNumber: {
        type: String,
        required: true
    },
    projectLocation: [{
        type: String
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    projectOffer: {
        type: mongoose.Schema.Types.ObjectId, ref: 'ProjectOfferType'
    },
    volunteerWorkers: {
        type: Number,
    },
    volunteerWorkersF: {
        type: Number,
    },
    volunteerWorkersNew: {
        type: Number,
    },
    otherWorkers: {
        type: Number,
    },
    otherWorkersF: {
        type: Number,
    },
    workersNoInfo: {
        type: Number,
    },
    workersNoInfoF: {
        type: Number,
    },
    numberOfEmployees: {
        type: Number
    },
    employeePreviousExperience: {
        type: Number,
    },
    femaleEmployees: {
        type: Number,
    },
    projectStreet: {
        type: String
    },
    projectPostalCode: {
        type: String
    },
    projectCity: {
        type: String
    },
    holderStreet: {
        type: String
    },
    holderPostalCode: {
        type: String
    },
    holderCity: {
        type: String
    },
    holderContacts: {
        type: Number
    },
    holderContactsPhone: {
        type: Number
    },
    holderContactsOnSite: {
        type: Number
    },
    spaceManagement: {
        type: Number
    },
    spaceManagementResidences: {
        type: Number
    },
    spaceManagementShared: {
        type: Number
    },
    projectManagement: {
        type: Number
    },
    projectManagementCoordination: {
        type: Number
    },
    projectManagementPlenum: {
        type: Number
    },
    projectManagementAdvisory: {
        type: Number
    },
    projectManagementContacts: {
        type: Number
    },
    committeeWork: {
        type: Number
    },
    committeeWorkTechnicalDiscussions: {
        type: Number
    },
    committeeWorkPSAG: {
        type: Number
    },
    committeeWorkOthers: {
        type: Number
    },
    publicRelation: {
        type: Number
    },
    publicRelationPresentation: {
        type: Number
    },
    publicRelationInformation: {
        type: Number
    },
    publicRelationSpecialistArticles: {
        type: Number
    },
    publicRelationInternetPresence: {
        type: Number
    },
    publicRelationContacts: {
        type: Number
    },
    qualityA: {
        type: String
    },
    qualityB: {
        type: String
    },
    qualityC: {
        type: String
    },
    holderDataA: {
        type: String
    },
    holderDataB: {
        type: String
    },
    numberPeopleWithFeedback: {
        type: Number
    },
    participantContactOutsideHome: {
        type: Number
    },
    participantInfluenceOnProgram: {
        type: Number
    },
    participantFeelsRespected: {
        type: Number
    },
    meaningfullFeedback: {
        type: Number
    },
    grantYear: {
        type: Number
    },
    projectTitle: {
        type: String
    },
    phone: {
        type: String
    },
    association: {
        type: Number
    },
    physicalDisability: {
        type: Boolean
    },
    mentalDisability: {
        type: Boolean
    },
    psychologicalDisability: {
        type: Boolean
    },
    sensoryDisability: {
        type: Boolean
    },
    multipleDisabilities: {
        type: Boolean
    },
    autism: {
        type: Boolean
    },
    withAndWithoutDisability: {
        type: Boolean
    },
    otherDisability: {
        type: Boolean
    },
    projectType: {
        type: mongoose.Schema.Types.ObjectId, ref: 'ProjectType'
    }
},
    { timestamps: true }
);

const Project = mongoose.model('Project', projectSchema)

module.exports = Project