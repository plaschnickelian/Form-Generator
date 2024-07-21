// errors.js
class CError extends Error { 
    constructor(statusCode, message, type) {
        super();
        this.type       = type;   
        this.message    = message;
        this.statusCode = statusCode;
    }
  }

  module.exports = { CError }