const mongoose = require('mongoose');

const Userschema = new mongoose.Schema({
  username: { type: String, required: true },
  email:    { type: String, required: true },
  password: { type: String, required: true },
  profilepic:{type: String},
  bio:       {type: String},
  followers: { type: [String], default: [] },
  following: { type: [String], default: [] },
  chats: [
  {
    withUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    messages: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        message: String,
        timestamp: Date
      }
    ]
  }
]
,
  
  saved:[
        {
            username:String,
            imageurl:String
        }
    ],
});

module.exports = mongoose.model('user', Userschema);
