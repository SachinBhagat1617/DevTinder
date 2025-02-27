const mongoose = require('mongoose');
const connectDB = async() => {
    try {
        await mongoose.connect(
          "mongodb+srv://sachinbhagat:Sachin%402247@practisecluster.br2ef.mongodb.net/?retryWrites=true&w=majority&appName=PractiseCluster/devTinder"
        );
        console.log("MongoDB got connected")
    } catch (error) {
        console.log("MongoDB connection error");
    }
}
module.exports = connectDB;