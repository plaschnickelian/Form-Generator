const { mongoose } = require('mongoose')

//Mongodb collection generieren (sql table)
const projectTypeSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    projectTypeDescription: {
        type: String,
        default: null
    },
    shortDescription: {
        type: String,
        default: null
    }
},
    { timestamps: true }
);

const ProjectType = mongoose.model('ProjectType', projectTypeSchema)

module.exports = ProjectType