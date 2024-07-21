const bcrypt = require('bcryptjs')
const { mongoose } = require('mongoose')

//Mongodb collection generieren (sql table)
const userSchema = new mongoose.Schema({
  userLastName: {
    type: String,
    required: [true, 'Kein Nachname angegeben']
  },
  userFirstName: {
    type: String,
    required: [true, 'Kein Vorname angegeben']
  },
  userMail: {
    type: String,
    required: [true, 'Keine E-Mail angegeben'],
    unique: true
  },
  userPassword: {
    type: String,
    required: [true, 'Kein Passwort angegeben'],
    select: false
  },
  isAdministrator: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    required: true,
    default: true
  },
  userProject: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Project'
  },
  userResetPasswordToken: {
    type: String
  },
  userResetPasswordExpires: {
    type: Date
  },
  lastLogin: {
    type: Date,
    default: null
  }
},
  { timestamps: true }
);

userSchema.pre('findOneAndUpdate', function (next) {
  const data = this.getUpdate().$set;
  if (Object.keys(data).includes('userPassword')) {
    bcrypt.hash(data.userPassword, 10).then((hashedPassword) => {
      this.getUpdate().$set.userPassword = hashedPassword
      next()
    })
  } else {
    next()
  }
}, function (err) {
  next(err)
});

//user passwort wird gehasht falls nicht schon geschehen
userSchema.pre("save", function (next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('userPassword')) return next();

  // generate a salt
  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.userPassword, salt, function (err, hash) {
      if (err) return next(err);
      // override the cleartext password with the hashed one
      user.userPassword = hash;
      next();
    });
  });
})

//user wird geprüft ob id gueltig bzw vorhanden oder nicht
userSchema.post('save', function (error, doc, next) {
  if (error.code === 11000) {
    next(new Error("Benutzer ID ist bereits vorhanden"))
  } else {
    next(error)
  }
})

//user passwort vergleich fuer login
userSchema.methods.matchPassword = async function (passwordEnteredByUser) {
  const user = await User.findOne({ _id: this._id }).select('userPassword').exec();

  return await bcrypt.compare(passwordEnteredByUser, user.userPassword);
}
const User = mongoose.model('User', userSchema)

module.exports = User