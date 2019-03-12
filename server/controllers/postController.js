const mutler = require("multer");
const jimp = require("jimp");
const mongoose = require("mongoose");
const Post = mongoose.model("Post");

const uploadImageOptions = {
  storage: mutler.memoryStorage(),
  limits: {
    filesize: 1024 * 1024 * 1
  },
  fileFilter: (req, file, next) => {
    if (file.mimetype.startsWith("image/")) {
      next(null, true);
    } else {
      next(null, true);
    }
  }
};

exports.uploadImage = mutler(uploadImageOptions).single("image");

exports.resizeImage = async (req, res, next) => {
  if (!req.file) {
    return next();
  }

  const extension = req.file.mimetype.split("/")[1];
  req.body.image = `/static/uploads/${
    req.user.name
  }-${Date.now()}.${extension}`;

  const image = await jimp.read(req.file.buffer);
  await image.resize(750, jimp.AUTO);
  await image.write(`./${req.body.image}`);
  next();
};

exports.addPost = async (req, res) => {
  req.body.postedBy = req.user._id;
  const newPost = await new Post(req.body).save();
  await Post.populate(newPost, {
    path: "postedBy",
    select: "_id name avatar"
  });
  res.json(newPost);
};

exports.deletePost = async (req, res) => {
  if (!req.isPoster) {
    return res
      .status(400)
      .json({ message: "You are not Authorized to perform this action" });
  }
  const post = await Post.findOneAndDelete({ _id: req.post._id });
  res.json(post);
};

exports.getPostById = async (req, res, next, id) => {
  const post = await Post.findOne({ _id: id });
  req.post = post;

  const posterId = mongoose.Types.ObjectId(req.post.postedBy._id);
  if (req.user && posterId.equals(req.user._id)) {
    req.isPoster = true;
    return next();
  }
  next();
};

exports.getPostsByUser = async (req, res) => {
  const posts = await Post.find({ postedBy: req.profile.id }).sort({
    createdAt: "desc"
  });
  res.json(posts);
};

exports.getPostFeed = async (req, res) => {
  const { following, _id } = req.profile;
  following.push(_id);

  const posts = await Post.find({ postedBy: { $in: following } }).sort({
    createdAt: "desc"
  });
  res.json(posts);
};

exports.toggleLike = async (req, res) => {
  const { postId } = req.body;
  const post = await Post.findOne({ _id: postId });
  const likes = post.likes.map(id => id.toString());

  const authId = req.user._id.toString();
  if (likes.includes(authId)) {
    await post.likes.pull(authId);
  } else {
    await post.likes.push(authId);
  }
  await post.save();
  res.json(post);
};

exports.toggleComment = async (req, res) => {
  const { comments, postId } = req.body;
  let operator;
  let data;

  if (req.url.includes("uncomment")) {
    operator = "$pull";
    data = { _id: comments._id };
  } else {
    operator = "$push";
    data = { text: comments.text, postedBy: req.user._id };
  }

  const post = await Post.findOneAndUpdate(
    { _id: postId },
    {
      [operator]: { comments: data }
    },
    { new: true }
  )
    .populate("postedBy", "_id name avatar")
    .populate("comments.postedBy", "_id name avatar");

  res.json(post);
};
