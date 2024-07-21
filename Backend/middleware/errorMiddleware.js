const notFound = (err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode
  res.status(statusCode)
  res.json({
    message: err.message
  })
}

const handleError = (status, message, res) => {
  res.status(status).json({
    message: message
  }).send(status,message);
}

function errorLogger(error, req, res, next) {

  next(error)
}

function errorResponder(error, req, res, next) { 
  switch (error.type) {
    case "redirect":              res.redirect('/error'); break;
    case "invalid-params"  :      res.status(400); res.send(error); break;
    case "authorization-failed":  res.status(401); res.send(error); break;
    case "not-found":             res.status(404).send(error); break;
    case "time-out":              res.status(408).send(error); break;
    case "database":              res.status(400).send(error); break;
    case "already-exist":         res.status(409).send(error); break;
    default :              res.status(444).send(error); break; 
  }
}

const handleDBError = (err, res) => {
  console.log(err.message);
  console.log(err.status);
  console.log(err.statusCode);

  return res.status(res.statusCode).json({
    message: err.message
  })
}

module.exports = { notFound, handleDBError, handleError, errorResponder, errorLogger }
