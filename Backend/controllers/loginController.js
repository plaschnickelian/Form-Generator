const crypto = require('node:crypto');
const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel.js')
const generateToken = require('../utils/generateToken.js')
const { RateLimiterMemory } = require('rate-limiter-flexible');
const { handleDBError, errorHandler, handleError } = require('../middleware/errorMiddleware.js')
const { CError } = require('../middleware/error.js');
require('dotenv').config();

const maxWrongAttemptsByIPperMinute = 5;
const maxWrongAttemptsByIPperDay = 100;

const limiterFastBruteByIP = new RateLimiterMemory({
  keyPrefix: 'login_fail_ip_per_minute',
  points: maxWrongAttemptsByIPperMinute,
  duration: 30,
  blockDuration: 60 * 10, // block for 10 minutes, if too many wrong attempts per minute
});

const limiterSlowBruteByIP = new RateLimiterMemory({
  keyPrefix: 'login_fail_ip_per_day',
  points: maxWrongAttemptsByIPperDay,
  duration: 60 * 60 * 24,
  blockDuration: 60 * 60 * 24, // block for 1 day, if too many wrong attempts per day
})

const loginUser = asyncHandler(async (req, res, next) => {
  const ipAddr = req.socket.remoteAddress;

  const [resFastByIP, resSlowByIP] = await Promise.all([
    limiterFastBruteByIP.get(ipAddr),
    limiterSlowBruteByIP.get(ipAddr)
  ]);

  let retrySecs = 0;

  if (resSlowByIP !== null && resSlowByIP.consumedPoints > maxWrongAttemptsByIPperDay) {
    retrySecs = Math.round(resSlowByIP.msBeforeNext / 1000) || 1;
  }
  else if (resFastByIP !== null && resFastByIP.consumedPoints > maxWrongAttemptsByIPperMinute) {
    retrySecs = Math.round(resFastByIP.msBeforeNext / 1000) || 1;
  }

  if (retrySecs > 0) {
    res.set('Retry-After', String(retrySecs));
    res.status(429).send('Too Many Requests');
  }
  else {
    //check if required parameters for login are available in request
    if (!req.body.userMail || !req.body.userPassword) {
      throw new CError(400, "Benutzername oder Passwort sind nicht angegeben!", "invalid-params");
    }

    const { userMail, userPassword } = req.body;
    if (!typeof userMail === "string" || !typeof userPassword === "string") {
      next(new CError(400, "Parameter sind keine Strings", "invalid-params"));
    }
    else {
      //get user data from DB by email address
      //const user = await User.findOne({ userMail: userMail }).populate({path: 'userProject', populate: {path: 'projectType'}}).exec();
      const user = await User.findOne({ userMail: userMail }).populate({ path: 'userProject', populate: [{ path: 'projectOffer' }, { path: 'projectType' }] }).exec();

      //check if user exists
      if (!user) {
        await Promise.all([
          limiterFastBruteByIP.consume(ipAddr),
          limiterSlowBruteByIP.consume(ipAddr)
        ])
        return next(new CError(401, `Login des Benutzers ${req.body.userMail} nicht möglich. Kein Benutzer mit dieser Email`, "authorization-failed"));
      }

      const passwordMatch = await user.matchPassword(userPassword);

      //check if user password matches
      if (!passwordMatch) {
        await Promise.all([
          limiterFastBruteByIP.consume(ipAddr),
          limiterSlowBruteByIP.consume(ipAddr)
        ])
          .catch(err => {
            return res.status(429).send(err);
          })
        return next(new CError(401, `Login des Benutzers ${req.body.userMail} nicht möglich. Passwort oder Benutzername falsch!`, "authorization-failed"));
      }

      if (user && passwordMatch && user.isActive) {
        let lastLogin = new Date();

        User.findByIdAndUpdate(user._id, { lastLogin: lastLogin }, (err, data) => {
          if (err) console.log(err);
          else console.log(`[${user.userLastName}] letzter Login: ${lastLogin.toLocaleDateString("de-DE")}`);
        })

        res.json({
          _id: user._id,
          userFirstName: user.userFirstName,
          userLastname: user.userLastName,
          userMail: user.userMail,
          isAdministrator: user.isAdministrator,
          isActive: user.isActive,
          userProject: user.userProject,
          userToken: generateToken(user._id),
          lastLogin: lastLogin
        }).status(200)
      } else {
        //user is deactivated
        throw new CError(401, `Login des Benutzers ${req.body.userMail} nicht möglich. Bitte wenden Sie sich an einen Systemadministrator!`, "authorization-failed");
      }
    }
  }
})

const getUserProfile = asyncHandler(async (req, res) => {
  //sucht nach user und gibt ihn anschließen aus
  const user = await User.findById(req.user._id).lean().populate({ path: 'userProject', populate: [{ path: 'projectOffer' }, { path: 'projectType' }] });

  if (user) {
    res.json({
      id: user._id,
      firstName: user.userFirstName,
      lastName: user.userLastName,
      email: user.userMail,
      isAdministrator: user.isAdministrator,
      isActive: user.isActive,
      userToken: user.userToken,
      userProject: user.userProject
    });
  } else {
    throw new CError(404, `Benutzer nicht gefunden. Bitte wenden Sie sich an einen Systemadministrator!`, "not-found");
  }
})

module.exports = { loginUser, getUserProfile }
