var mongoose = require('mongoose');

var conMongoDB;

const connectDB = async () => {
    //verbindung zur db wird versucht aufzubauen
    try {
        const conMongoDB = await mongoose.connect(process.env.MONGO_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        console.log(process.env.MONGO_URI);
        console.log(`MongoDB verbunden: ${conMongoDB.connection.host}`)
    } catch (error) {
        console.log(`Error: ${error.message}`)
        process.exit(1)
    }
}

module.exports = {
    connectDB, conMongoDB
}
