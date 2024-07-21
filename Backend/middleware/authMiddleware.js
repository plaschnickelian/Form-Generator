const jwt = require('jsonwebtoken')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel.js')
const { CError } = require('./error.js')

const protectUser = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer')) {
    //token aus auth-header trennen
    token = authHeader.split(' ')[1]
    //korrektes token gibt userid aus
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log(err)
        console.log(err.message)
        next(new CError(400, "Token ist ungültig", "invalid-params"));
      }
      else if (user) {
        User.findById(user.id, (err, userObject) => {
          if (err || !userObject) {
            next(new CError(404, "Benutzer wurde nicht gefunden", "not-found"));
          }
          else if (!userObject.isActive) {
            next(new CError(401, "Benutzer ist deaktiviert", "authorization-failed"));
          }
          else {
            req.user = userObject;
            next();
          }
        })
      }
      else {
        next(new CError(404, "Benutzer wurde nicht gefunden", "not-found"));
      }
    });
  } else {
    next(new CError(400, "Kein Token im Header", "invalid-params"));
  }
});

const protectAdmin = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization

  if (authHeader && authHeader.startsWith('Bearer')) {
    //token aus auth-header trennen
    token = authHeader.split(' ')[1]
    //korrektes token gibt userid aus
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log(err)
        next(new CError(400, "Token ist ungültig", "invalid-params"));
      }
      else if (user) {
        User.findById(user.id, (err, userObject) => {
          if (err || !userObject) {
            next(new CError(404, "Benutzer wurde nicht gefunden", "not-found"));
          }
          else if (!userObject.isActive) {
            next(new CError(401, "Benutzer ist deaktiviert", "authorization-failed"));
          }
          else if (!userObject.isAdministrator) {
            next(new CError(401, "Benutzer ist kein Administrator", "authorization-failed"));
          }
          else {
            req.user = userObject;
            next();
          }
        })
      }
      else {
        next(new CError(404, "Benutzer wurde nicht gefunden", "not-found"));
      }
    });
  } else {
    next(new CError(400, "Kein Token im Header", "invalid-params"));
  }
})

module.exports = { protectUser, protectAdmin }
