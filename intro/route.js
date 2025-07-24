const Post = require('./post/Postmodel');
const User = require('./Usermodel');


const verifytoken = require('./verifytoken');
const express = require('express');
const router = express.Router();    
const usercontroller = require('./Usercontroller');
const postcontroller = require('./post/Postcontroller');
const upload = require('./cloud/CloudinaryConfig');
const mongoose = require('mongoose');

router.post('/create', usercontroller.createuser);
router.post('/login', usercontroller.login);
router.post('/addpost', verifytoken, upload.single('image'), postcontroller.createpost);
router.get('/getpost', verifytoken, postcontroller.getimage);
router.post('/handlelikes', verifytoken, postcontroller.like); // ✅ Updated from /handlelikes
router.post('/setup', verifytoken, upload.single('image'), usercontroller.setup);
router.get('/userprofile', verifytoken, postcontroller.userprofile);
router.post("/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  res.json({ imageUrl: req.file.path });
});
router.post('/follow',verifytoken,usercontroller.follow);
router.post('/comment',verifytoken,postcontroller.comment);
router.post('/userpost',verifytoken,postcontroller.userposts);
router.post('/targetprofile',verifytoken,postcontroller.targetprofile);
router.post('/unfollow',verifytoken,usercontroller.unfollow);
router.post('/saved',verifytoken,postcontroller.saved);
router.get("/search", postcontroller.search);
router.post("/updateprofile",verifytoken,postcontroller.updateuser);



// Get users that the current user is following
router.get('/following-users/:userId', postcontroller.mutual);

router.get('/chat-history/:fromId/:toId',postcontroller.chats);

module.exports = router;