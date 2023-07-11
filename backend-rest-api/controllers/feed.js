// const fs = require("fs");
// const path = require("path");
// const { validationResult } = require("express-validator");
// const Post = require("../models/post");
// const User = require("../models/user");
// // const {server} = require("socket.io");
// const io = require("../socket")

// exports.getPosts = (req, res, next) => {
//   const currentPage = req.query.page||1;
//   const perPage=2;
//   let totalItems = 0;
//   Post.find().countDocuments().then(count=>{
//     totalItems=count;
//     return Post.find().populate('creator')
//     .sort({createdAt:-1}).skip((currentPage-1)*perPage).limit(perPage);
//   })
//   .then((posts) => {
//     res.status(200).json({
//       message: "Fetched Posts Successfully",
//       posts: posts,
//       totalItems: totalItems
//     });
//   })
//   .catch(err=>{
//     if(!err.statusCode)
//     err.statusCode =500;

//     next(err);
//   })
  
// };

// // exports.createPost = (req, res, next) => {
// //   console.log("getting called createPost");
// //   const errors = validationResult(req);
// //   if (!errors.isEmpty()) {
// //     const error = new Error("Validation failed,entered data is incorrect");
// //     error.statusCode = 422;
// //     throw error;
// //   }
// //   if (!req.file) {
// //     const error = new Error("No image Provided");
// //     error.statusCode = 422;
// //     throw error;
// //   }
// //   console.log(req.file);
// //   const imageUrl = req.file.path;
// //   const title = req.body.title;
// //   const content = req.body.content;
// //   let creator;
// //   const post = new Post({
// //     title: title,
// //     content: content,
// //     imageUrl: imageUrl,
// //     creator: req.userId,
// //   });
// //   post
// //     .save()
// //     .then((result) => {
// //       // console.log(result);
// //       return User.findById(req.userId)
    
// //     }).then(user => {
// //       creator=user;
// //       user.posts.push(post);
// //       return user.save();
      
// //     }).then(result=>{
// //       console.log('type of creator is '+typeof creator);

// //       console.log(creator);
// //       io.getIO().emit('posts',{action:'create',post:{...post._doc,creator:{_id:req.userId},name:us}});
// //       res.status(201).json({
// //         message: "Post created successfully!",
// //         post: post,
// //         creator:{_id:creator._id,name:creator.name}
// //       });
// //     })
// //     .catch((err) => {
// //       if (!res.statusCode) res.statusCode = 500;
// //       console.log(err);
// //       next(err);
// //     });
// // };




// exports.createPost = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = new Error('Validation failed, entered data is incorrect.');
//     error.statusCode = 422;
//     throw error;
//   }
//   if (!req.file) {
//     const error = new Error('No image provided.');
//     error.statusCode = 422;
//     throw error;
//   }
//   const imageUrl = req.file.path;
//   const title = req.body.title;
//   const content = req.body.content;
//   const post = new Post({
//     title: title,
//     content: content,
//     imageUrl: imageUrl,
//     creator: req.userId
//   });
//   try {
//     await post.save();
//     const user = await User.findById(req.userId);
//     user.posts.push(post);
//     await user.save();
//     io.getIO().emit('posts', {
//       action: 'create',
//       post: { ...post._doc, creator: { _id: req.userId, name: user.name } }
//     });
//     res.status(201).json({
//       message: 'Post created successfully!',
//       post: post,
//       creator: { _id: user._id, name: user.name }
//     });
//   } catch (err) {
//     if (!err.statusCode) {
//       err.statusCode = 500;
//     }
//     next(err);
//   }
// };



// exports.getPost = (req, res, next) => {
//   const postId = req.params.postId;
//   // console.log(postId);
//   Post.findById(postId).populate('creator')
//     .then((post) => {
//       if (!post) {
//         const error = new Error("couldn't find post");
//         error.statusCode = 404;
//         throw error;
//       }
//       res.status(200).json({
//         message: "Post fetched!",
//         post: post,
//       });
//     })
//     .catch((err) => {
//       if (!res.statusCode) res.statusCode = 500;
//       console.log(err);
//       next(err);
//     });
// };

// // exports.updatePost = (req, res, next) => {
// //   const postId = req.params.postId;
// //   const errors = validationResult(req);
// //   if (!errors.isEmpty()) {
// //     const error = new Error("Validation failed,entered data is incorrect");
// //     error.statusCode = 422;
// //     throw error;
// //   }
// //   const title = req.body.title;
// //   const content = req.body.content;
// //   let imageUrl = req.body.image;
// //   console.log(req.body);
// //   if (req.file) {
// //     console.log('hehe');
// //     imageUrl = req.file.path;
// //   }
// //   if (!imageUrl) {
// //     console.log('no file');
// //     const error = new Error("No file picked");
// //     error.statusCode = 422;
// //     throw error;
// //   }

// //   Post.findById(postId)
// //     .then((post) => {
// //       if (!post) {
// //         const error = new Error("couldn't find post");
// //         error.statusCode = 404;
// //         throw error;
// //       }
// //       if(imageUrl!==post.imageUrl)
// //       {
// //         clearImage(post.imageUrl);
// //       }
// //       post.title = title;
// //       post.content = content;
// //       post.imageUrl = imageUrl;
// //       return post.save();
// //     }).then(result => {
// //       res.status(200).json({
// //         message:'Post Updated',
// //         post:result
// //       })
// //     })
// //     .catch((err) => {
// //       if (!res.statusCode) res.statusCode = 500;
// //       next(err);
// //     });
// // };
// exports.updatePost = async (req, res, next) => {
//   try {
//     //validation errors
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.log(errors.array());
//       const error = new Error("Validation failed.");
//       error.statusCode = 422;
//       error.details = errors.array();
//       return next(error);
//     }

//     //inputs
//     // console.log(req.body);
//     const { title, content } = req.body;
//     let postId = req.params.postId;

//     //fetch post
//     let post = await Post.findById(postId);
//     if (!post) {
//       let err = new Error("Could not find requested post");
//       err.statusCode = 404;
//       return next(err);
//     }
//     if(post.creator.toString()!==req.userId.toString())
//     {
//       const err = new Error("Not authorized");
//       err.statusCode =403;
//       throw err;
//     }

//     //check if there is a file being uploaded, to change imageUrl
//     let imageUrl;
//     if (req.file) {
//       imageUrl = req.file.path;
//     } else {
//       imageUrl = post.imageUrl;
//     }
//     //delete only if post.imageUrl is different from what we are sending (req.file.path)
//     if (post.imageUrl !== imageUrl) {
//       clearImage(post.imageUrl);
//     }

//     //update post object
//     post.title = title;
//     post.content = content;
//     post.imageUrl = imageUrl;

//     //answer
//     let updatedPost = await post.save();
//     res.status(200).json({ message: "Post updated!", post: updatedPost });
//   } catch (error) {
//     if (!error.statusCode) {
//       error.statusCode = 500;
//     }
//     next(error);
//   }
// };

// exports.deletePost = (req, res, next) => {
//   const postId = req.params.postId;
//   Post.findById(postId)
//     .then((post) => {
//       if (!post) {
//         const error = new Error("Post not found");
//         error.statusCode = 422;
//         throw error;
//       }
//       if(post.creator.toString()!==req.userId.toString()) {
//         const err = new Error("Not authorized");
//         err.statusCode =403;
//         throw err;

//       }
//       clearImage(post.imageUrl);
//       return Post.findByIdAndRemove(postId);
//     })
//     .then(result=>{
//       return User.findOne({_id:req.userId});
      
//     }).then(user=>{
//        user.posts.pull(postId);
//       return user.save();
//     }).then(result=>{
//       return res.status(200).json({message:'Post Delete Success'});
//     })
//     .catch((error) => {
//       if (!error.statusCode) error.statusCode = 500;
//       next(error);
//     });
// };

// const clearImage = (filePath) => {
//   filePath = path.join(__dirname, "..", filePath);
//   fs.unlink(filePath, (err) => {
//     console.log(err);
//   });
// };












const fs = require('fs');
const path = require('path');

const { validationResult } = require('express-validator');
const io = require('../socket');
const Post = require('../models/post');
const User = require('../models/user');

exports.getPosts = async (req, res, next) => {
  const currentPage = req.query.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate('creator')
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * perPage)
      .limit(perPage);

    res.status(200).json({
      message: 'Fetched posts successfully.',
      posts: posts,
      totalItems: totalItems
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId
  });
  try {
    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();
    io.getIO().emit('posts', {
      action: 'create',
      post: { ...post._doc, creator: { _id: req.userId, name: user.name } }
    });
    res.status(201).json({
      message: 'Post created successfully!',
      post: post,
      creator: { _id: user._id, name: user.name }
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  const post = await Post.findById(postId);
  try {
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json({ message: 'Post fetched.', post: post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }
  try {
    const post = await Post.findById(postId).populate('creator');
    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator._id.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const result = await post.save();
    io.getIO().emit('posts', { action: 'update', post: result });
    res.status(200).json({ message: 'Post updated!', post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);

    if (!post) {
      const error = new Error('Could not find post.');
      error.statusCode = 404;
      throw error;
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error('Not authorized!');
      error.statusCode = 403;
      throw error;
    }
    // Check logged in user
    clearImage(post.imageUrl);
    await Post.findByIdAndRemove(postId);

    const user = await User.findById(req.userId);
    user.posts.pull(postId);
    await user.save();
    io.getIO().emit('posts', { action: 'delete', post: postId });
    res.status(200).json({ message: 'Deleted post.' });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};