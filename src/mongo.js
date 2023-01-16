const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/JSImage")
    .then(() => {

        console.log("mongo connected");
    })
    .catch(() => {
        console.log("failed to connect");
    })


const LogInSchema = new mongoose.Schema({
    // name:{
    //     type:String,
    //     required:true
    // },
    path: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    }
})


const collection = new mongoose.model("imgCollection", LogInSchema)

module.exports = collection