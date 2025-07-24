const cloudinary = require("cloudinary").v2
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const multer = require("multer")
const dotenv = require('dotenv')

cloudinary.config({
    cloud_name: "dcoa2dcnb",
    api_key: "789237159442939" ,
    api_secret:"4IZMptSt0VUo3NmTJzAIEA4Hk98"
})

const storage = new CloudinaryStorage({
    cloudinary,
    params:{
        folder : "Dynamic folders",
        allowed_formats: ["jpg", "png", "jpeg"],
    }
})
const upload = multer({storage})

module.exports = upload