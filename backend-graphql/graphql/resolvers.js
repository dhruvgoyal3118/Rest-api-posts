const bcrypt = require("bcryptjs");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const validator = require("validator").default;
const Post = require("../models/post");
const path = require('path');
const fs = require('fs');
const clearImage = filePath => {
  filePath = path.join(__dirname,'..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
module.exports = {
  createUser: async function ({ userInput }, req) {
    // we could have used arg,instead of {userInput} and used arg.userInput.email
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "E-Mail is invalid." });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      errors.push({ message: "Password too short!" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const existingUser = await User.findOne({ email: userInput.email });
    if (existingUser) {
      const error = new Error("User exists already!");
      //   error.code=422;
      throw error;
    }
    const hashedPw = await bcrypt.hash(userInput.password, 12);
    const user = new User({
      email: userInput.email,
      name: userInput.name,
      password: hashedPw,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
  },

  login: async function ({ email, password }, req) {
    const user = await User.findOne({ email: email });
    if (!user) {
      const error = new Error("User Not Found");
      error.code = 401;
      throw error;
    }
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error("Incorrect password");
      error.code = 401;
      throw error;
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      "somesupersecret",
      { expiresIn: "1h" }
    );

    return { token: token, userId: user._id.toString() };
  },

  createPost: async function ({ postInput }, req) {
    // console.log('view ')
    // console.log(req.isAuth);
    if (!req.isAuth) {
      const error = new Error("Not authenticated  bidu ");
      error.code = 401;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      console.log("hehe2");
      errors.push({ message: "Title is Invalid" });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Content is Invalid" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error("User not found.");
      error.code = 401;
      throw error;
    }
    const post = new Post({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: user,
    });
    const createdPost = await post.save();
    user.posts.push(createdPost);
    await user.save();
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },
  posts: async function ({ page }, req) {
    // console.log('You must');
    if (!req.isAuth) {
      const error = new Error("Not authenticated  bidu ");
      error.code = 401;
      throw error;
    }
    if (!page) {
      page = 1;
      console.log("You must");
    }

    const perPage = 2;
    const totalPosts = await Post.find().countDocuments();
    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator");

    return {
      posts: posts.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
      totalPosts: totalPosts,
    };
  },

  post: async function ({ id }, req) {
    // console.log(`post is `)
    if (!req.isAuth) {
      const error = new Error("Not authenticated  bidu ");
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id).populate("creator");
    if (!post) {
      const error = new Error("Post not found");
      error.code = 404;
      throw error;
    }

    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },

  updatePost: async function ({ id, postInput }, req) {
    if (!req.isAuth) {
      const error = new Error("Not authenticated  bidu ");
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id).populate("creator");
    if (!post) {
      const error = new Error("Post not found");
      error.code = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId.toString()) {
      const error = new Error("Not authorized bidu");
      error.code = 403;
      throw error;
    }
    const errors = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      console.log("hehe2");
      errors.push({ message: "Title is Invalid" });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "Content is Invalid" });
    }
    if (errors.length > 0) {
      const error = new Error("Invalid input.");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    post.title = postInput.title;
    post.content = postInput.content;
    if (postInput.imageUrl !== "undefined") {
      post.imageUrl = postInput.imageUrl;
    }
    const updatedPost = await post.save();
    return {
      ...updatedPost._doc,
      _id: updatedPost._id.toString(),
      createdAt: updatedPost.createdAt.toISOString(),
      createdAt: updatedPost.createdAt.toISOString(),
    };

  },
  deletePost: async function({id},req){
    if (!req.isAuth) {
      const error = new Error("Not authenticated  bidu ");
      error.code = 401;
      throw error;
    }
    const post = await Post.findById(id);
    if(!post)
    {
      const error = new Error('Post not found');
      error.code = 404;
      throw error;
    }
    if(req.userId.toString()!==post.creator.toString()) {
      const error = new Error('Not authenticated bidu');
      error.code = 403;
      throw error;
    }
    clearImage(post.imageUrl);
    await Post.findByIdAndDelete(id);
    const user = await User.findById(req.userId);
    user.posts.pull(id);
    await user.save();
    return true;

  },
  user:async function(args,req){
    if (!req.isAuth) {
      const error = new Error("Not authenticated  bidu ");
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if(!user)
    {
      const error = new Error('User not found');
      error.code = 404;
      throw error;
    }
    return {
      ...user._doc,
      id:user._id.toString(),

    };
  },
  updateStatus:async function({status},req){
    if (!req.isAuth) {
      const error = new Error("Not authenticated  bidu ");
      error.code = 401;
      throw error;
    }
    const user = await User.findById(req.userId);
    if(!user)
    {
      const error = new Error('User not found');
      error.code = 404;
      throw error;
    }
    user.status = status;
    const updatedUser = await user.save();
    return {
      ...updatedUser._doc,
      id: updatedUser._id.toString(),
    }

  }, 
  

};

