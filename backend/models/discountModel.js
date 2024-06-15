const mongoose = require("mongoose")

const discountModel = mongoose.Schema({
    code:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    maxAmount:{
        type:Number,
        required:true
    }
})


module.exports = mongoose.model('Discounts',discountModel)