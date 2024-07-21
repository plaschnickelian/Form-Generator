const jwt = require('jsonwebtoken')

//generiert token, welches nach 12h abläuft
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '12h' });
}

module.exports = generateToken