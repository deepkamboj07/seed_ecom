const mongoose = require("mongoose")

const photoModel = mongoose.Schema({
    keys:[{
        type:String,
    }]
})

module.exports = mongoose.model("Photo",photoModel)