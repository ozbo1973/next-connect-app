import axios from "axios";

export const getUser = async userId => {
  const { data } = await axios.get(`/api/users/profile/${userId}`);
  return data;
};

export const followUser = async followId => {
  const { data } = await axios.put("/api/users/follow", { followId });
  return data;
};

export const unFollowUser = async followId => {
  const { data } = await axios.put("/api/users/unfollow", { followId });
  return data;
};

export const deleteUser = async userId => {
  const { data } = await axios.delete(`/api/users/${userId}`);
  return data;
};

export const getAuthUser = async userId => {
  const { data } = await axios.get(`/api/users/${userId}`);
  return data;
};

export const userDataSave = async (userId, userData) => {
  const { data } = await axios.put(`/api/users/${userId}`, userData);
  return data;
};

export const getUserFeed = async authUserId => {
  const { data } = await axios.get(`/api/users/feed/${authUserId}`);
  return data;
};

export const addPost = async (userId, post) => {
  const { data } = await axios.post(`/api/posts/new/${userId}`, post);
  return data;
};

export const getPostFeed = async userId => {
  const { data } = await axios.get(`/api/posts/feed/${userId}`);
  return data;
};

export const deletePost = async postId => {
  const { data } = await axios.delete(`/api/posts/${postId}`);
  return data;
};

export const likePost = async postId => {
  const { data } = await axios.put(`/api/posts/like`, { postId });
  return data;
};

export const unlikePost = async postId => {
  const { data } = await axios.put(`/api/posts/unlike`, { postId });
  return data;
};

export const addComment = async (postId, comments) => {
  const { data } = await axios.put("/api/posts/comment", { postId, comments });
  return data;
};

export const deleteComment = async (postId, comments) => {
  const { data } = await axios.put("/api/posts/uncomment", {
    postId,
    comments
  });
  return data;
};

export const getUserPosts = async userId => {
  const { data } = await axios.get(`/api/posts/by/${userId}`);
  return data;
};
