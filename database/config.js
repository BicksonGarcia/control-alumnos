const mongoose = require('mongoose');
const { CLIENT_RENEG_LIMIT } = require('tls');
const dbConection = async () => {
    try {
        mongoose.set("strictQuery", false);
        await mongoose.connect(process.env.MONGODB_CNN);
        console.log("MongoDB Connected");

    } catch (error) {
        console.log(error);
        throw new Error('Failed to connect to MongoDB');
    }
}

module.exports = {
    dbConection
}