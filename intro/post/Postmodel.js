//thi sis postmodel.js
const mongoose = require('mongoose')

const Postschema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },imageuser:{
        type:String,
        ref:'User'
    },
    image:{
        type:String,
        
    },
    caption:{
        type:String,
        
    },
    likes:{
        type:[String] ,
        default:[]
    },
    comment:[
        {
            username:String,
            text:String,
        }
    ] , 
    
    createdAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model('post',Postschema)