const bcrypt = require('bcryptjs')
const { mongoose } = require('mongoose')

//Mongodb collection generieren (sql table)
const projectOfferTypeSchema = new mongoose.Schema({
    projectOfferTypeID: {
        type: Number,
        required: [true, 'Keine ID angegeben'],
        unique: true
    },
    projectOfferType: {
        type: String,
        required: [true, 'Kein Name angegeben'],
        unique: true
    },
    isActive: {
        type: Boolean
    }
},
    { timestamps: true }
);

//user wird geprüft ob id gueltig bzw vorhanden oder nicht
/* projectOfferTypeSchema.post('save', function (error, doc, next) {
    if (error.code === 11000) {
      next(new Error("Bereits vorhanden"))
    } else {
      next(error)
    }
  }) */

const ProjectOfferType = mongoose.model('ProjectOfferType', projectOfferTypeSchema)

module.exports = ProjectOfferType