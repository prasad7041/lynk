//this is usercontroller.js
const user = require('./Usermodel')
const jwt = require("jsonwebtoken")
const secretkey = "secretkey"


const createuser = async (req, res) => {
  try {
    const { email, username, password } = req.body;

    const person = await user.findOne({ email });
    if (person) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const User = new user({
      username,
      email,
      password,
    });

    await User.save();

    const token = jwt.sign(
      { id: User._id, username: User.username },
      secretkey,
      { expiresIn: '1h' }  // Correct time format '1h' not '1hr'
    );

    res.status(201).json({ user: User, token });
  } catch (err) {
    console.log("Error in control:", err);
    res.status(500).json({ message: "Server error" });
  }
};



const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log("login::",username,password)
    if (!username || !password) {
      return res.status(400).json({ 
        success: false,
        message: 'Username and password are required' 
      });
    }

    const person = await user.findOne({ username });
    if (!person) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    if (person.password !== password) {
      return res.status(401).json({ 
        success: false,
        message: 'Invalid credentials' 
      });
    }

    const token = jwt.sign(
      { id: person._id, username: person.username },
      process.env.JWT_SECRET || secretkey,
      { expiresIn: '1h' }
    );
    console.log("login success",token)
    res.status(200).json({ 
      success: true,
      message: 'Login successful', 
      token,
      user: {
        id: person._id,
        username: person.username
      }
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error' 
    });
  }
};

const setup = async (req, res) => {
  try {
    const { profilepic,bio } = req.body;
    const userid = req.user.id;
    console.log("this from controller::",req.user.id)
    const User = await user.findById(userid);
    if (!User) return res.status(404).json({ message: "User not found" });
      User.profilepic = profilepic;  // Save filename or full path based on your need
    User.bio = bio;
    await User.save();
    console.log('controller baji::',User)
    res.json({ message: "Profile updated successfully", user: User });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error in updating" });
  }
};

const follow = async(req,res)=>{
  try{
  const username = req.user.username;
  const targetname = req.body.targetname ;
  console.log("username::",username);
  console.log("target name::",targetname)
  if(targetname == username ) return res.status(404).json({message:"you cant follow your account"})
  const useraccount = await user.findOne({username:username})
  const targetaccount = await user.findOne({username:targetname})
  console.log("useraccount1::",useraccount);
  console.log("targetaccount1::",targetaccount);
  if(!useraccount.following)  useraccount.following = [] ;
  if(!targetaccount.followers)  targetaccount.followers = [] ;
  useraccount.following.push(targetname) ;
  targetaccount.followers.push(username) ; 
  console.log("useraccount::",useraccount);
  console.log("targetaccount::",targetaccount);
  await useraccount.save();
  await targetaccount.save(); 
  res.status(200).json({Targetaccount:targetaccount,Useraccount:useraccount,User:username,target:targetname,updatedFollowers: targetaccount.followers, // 👈 THIS IS IMPORTANT
      message: "Follow successful",})
}catch(err){
  res.status(500).json({error:err})
  console.log("error::",err)
}
}
const message = async(req,res)=>{
  
}

const unfollow = async (req, res) => {
  try {
    console.log("unfollow");
    const username = req.user.username;
    const targetname = req.body.targetname;
    
    if (targetname == username) {
      return res.status(404).json({ message: "you cant unfollow your own account" });
    }

    const useraccount = await user.findOne({ username: username });
    const targetaccount = await user.findOne({ username: targetname });

    if (!useraccount || !targetaccount) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize arrays if they don't exist
    if (!useraccount.following) useraccount.following = [];
    if (!targetaccount.followers) targetaccount.followers = [];

    // Filter and assign back to the arrays
    useraccount.following = useraccount.following.filter(u => u !== targetname);
    targetaccount.followers = targetaccount.followers.filter(u => u !== username);

    await useraccount.save();
    await targetaccount.save();

    res.status(200).json({
      Targetaccount: targetaccount,
      Useraccount: useraccount,
      User: username,
      target: targetname,
      updatedFollowers: targetaccount.followers,
      message: "Unfollow successful",
    });
  } catch (err) {
    console.log("error::", err);
    res.status(500).json({ error: err.message });
  }
};



module.exports = { createuser, login ,setup , follow , unfollow };
