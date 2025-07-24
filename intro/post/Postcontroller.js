const Post = require('./Postmodel');
const User = require('../Usermodel');

// ✅ Create a post with uploaded image (req.file.path from multer)
const createpost = async (req, res) => {
  try {
    const { caption } = req.body;
    const imagePath = req.body.image;
    const userid = req.userid;
    
    const newPost = new Post({
      user: userid,
      imageuser: req.user.username,
      image: imagePath,
      caption,
      createdAt: new Date(),
    });

    await newPost.save();

    res.status(201).json({ message: "Post created successfully", post: newPost });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error occurred while creating post" });
  }
};

// ✅ Get all posts with essential details

const getimage = async (req, res) => {
  try {
    const username = req.user.username;

    const useraccount = await User.findOne({ username: username });
    if (!useraccount) {
      return res.status(404).json({ message: "User not found" });
    }

    // Get posts NOT created by the user and sort by newest
    const userPosts = await Post.find({ imageuser: { $ne: username } }, 'image imageuser comment caption likes createdAt')
      .populate('user', 'username') // optional
      .sort({ createdAt: -1 });

    // For each post, fetch profilepic of imageuser
    const imageUrls = await Promise.all(
      userPosts
        .filter(post => post.image)
        .map(async (p) => {
          // Get user info for the imageuser
          const imageUserAccount = await User.findOne({ username: p.imageuser });
         // console.log("profilepic at maps:",imageUserAccount);
          return {
            image: p.image,
            id: p._id,
            imageuser: p.imageuser,
            profilepic: imageUserAccount?.profilepic || '', // fallback if not found
            caption: p.caption,
            likes: p.likes,
            comment: p.comment,
          };
        })
    );

    //console.log("image urls:", imageUrls);

    res.status(200).json({
      posts: imageUrls,
      user: username,
      userfollowing: useraccount.following || [],
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ message: "Error fetching posts" });
  }
};


// ✅ Get logged-in user profile + posts
const userprofile = async (req, res) => {
  try {
    const username = req.user.username;
    const userposts = await Post.find({ imageuser: username });
    const UserDoc = await User.findOne({ username });
    //console.log("userpots::",userposts);
    res.status(200).json({
      posts: userposts,
      user: username,
      bio: UserDoc?.bio || "",
      profilepic: UserDoc?.profilepic || "" ,
      followers : UserDoc?.followers || "",
      following : UserDoc?.following || "",
      saved : UserDoc?.saved || "",
    });
  } catch (err) {
    res.status(500).json({ message: "Error occurred fetching profile" });
  }
};


const like = async (req, res) => {
  try {
    const postId = req.body.targetid;
    const username = req.user.username;
    console.log("this is handle like");
    const targetpost = await Post.findById(postId);
    if (!targetpost) return res.status(404).json({ message: "Post not found" });
    //console.log("taget acc::",targetpost);
    if (!targetpost.likes) targetpost.likes = [];

    const alreadyLiked = targetpost.likes.includes(username);

    if (alreadyLiked) {
      // Unlike
      targetpost.likes = targetpost.likes.filter(u => u !== username);
    } else {
      // Like
      targetpost.likes.push(username);
    }

    await targetpost.save();

    res.status(200).json({
      message: alreadyLiked ? "Unliked" : "Liked",
      likes: targetpost.likes,
      likesCount: targetpost.likes.length,
    });
  } catch (err) {
    console.error("error::", err);
    res.status(500).json({ message: "Server error" });
  }
};

const searchdetails = async(req,res) => {
  try{
  const targetname = req.body.targetname ;
  if(!targetname) return console.log("targetname is null");
  const targetaccount = User.find({username:targetname});
  const targetposts = Post.find({imagename:targetname});
  console.log("thisis target details::",targetaccount,targetposts);
  res.json({account:targetaccount,posts:targetposts})
  }catch(err){
    res.status(401).json({message:"error occured"})
  }
}

const comment = async(req,res)=>{
  try{
  const username = req.user.username ;
  const {postid , text } = req.body ;
  console.log("this is handle comment")
  if(!text){ return console.log("enter any text")}
  const postaccount = await Post.findById(postid);
  //console.log("comment details::",postaccount);
  postaccount.comment.push({username:username,text:text});
  await postaccount.save();
  res.status(201).json({post:postaccount});
  }catch(err){
    console.log("error",err);
    res.json({error:err})
  }
}

const userposts = async(req,res)=>{
  try{
  const username = req.user.username ;
  const userposts = await Post.find({imageuser:username});
  res.json({posts:userposts});
  }catch(err){
    console.log("error occured");
  }
}

const targetprofile = async(req,res)=>{
  try{
    const username = req.user.username;
    const targetusername = req.body.username; 
    console.log("targetname::",targetusername);
    const targetaccount = await User.find({username:targetusername}).lean();
    const targetposts = await Post.find({imageuser:targetusername}).lean();
    console.log("deatils in target:",targetaccount,targetposts);
    res.json({targetaccount,targetposts,username})
  }catch(err){
    console.log("error occured:",err);
    res.status(401).json({message:"error occured"})
  }
}

const search = async (req, res) => {
  try {
    const query = req.query.q;

    if (!query) return res.status(400).json({ message: "Query required" });

    const users = await User.find({
      username: { $regex: query, $options: "i" },
    })
      .select("username profilepic")
      .limit(10)
      .lean();

    res.json(users);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

const saved = async (req, res) => {
  try {
    const username = req.user.username;
    const postid = req.body.targetid;

    const useraccount = await User.findOne({ username }); // use findOne, not find
    const post = await Post.findById(postid);

    if (!useraccount || !post) {
      return res.status(404).json({ message: "User or Post not found" });
    }

    if (!useraccount.saved) useraccount.saved = [];

    // Avoid duplicates
    if (!useraccount.saved.includes(post.image)) {
      useraccount.saved.push({username:post.imageuser,imageurl:post.image});
      await useraccount.save();
    }

    console.log("useraccount in saved:", useraccount);
    res.json({ message: "Saved successfully" });
  } catch (err) {
    console.error("error in saved:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const updateuser = async (req, res) => {
  try {
    const { username, bio } = req.body;

    // Find user by token
    const currentUser = await User.findOne({ username: req.user.username });
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update fields
    if (username) currentUser.username = username;
    if (bio) currentUser.bio = bio;

    await currentUser.save();

    res.status(200).json({ message: "Profile updated successfully" });
  } catch (err) {
    console.error("Error updating profile:", err);
    res.status(500).json({ message: "Server error" });
  }
}
const mutual = async (req, res) => {
  try {
    // Validate user ID format
    // if (!mongoose.Types.ObjectId.isValid(req.params.userId)) {
    //   return res.status(400).json({ 
    //     success: false,
    //     message: 'Invalid user ID format'
    //   });
    // }

    // Find user with populated following list
    const user = await User.findById(req.params.userId)
      .select('following')
      .populate({
        path: 'following',
        select: '_id username profilepic'
      })
      .lean();

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found'
      });
    }

    // Format response
   const response = (user.following || [])
  .filter(u => u && u._id)
  .map(u => ({
    id: u._id.toString(),
    username: u.username || '',
    profilepic: u.profilepic || ''
  }));

    res.json({ 
      success: true,
      data: response 
    });

  } catch (err) {
    console.error('SERVER ERROR:', err);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error'
    });
  }
}

const chats =  async (req, res) => {
  try {
    const { fromId, toId } = req.params;

    const user = await User.findById(fromId);
    const chat = user.chats.find(c => c.withUser.toString() === toId);

    if (!chat) return res.json({ messages: [] });

    res.json({ messages: chat.messages });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error loading chat history' });
  }
}

module.exports = { createpost, getimage,chats, userprofile,mutual, like,comment,userposts,targetprofile,search,saved,updateuser };
