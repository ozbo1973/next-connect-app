import {
  addPost,
  getPostFeed,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment
} from "../../lib/api";
import Post from "./Post";
import NewPost from "./NewPost";

import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

class PostFeed extends React.Component {
  state = {
    posts: [],
    text: "",
    image: "",
    isDeleting: false,
    isAddingPost: false
  };

  componentDidMount() {
    this.postData = new FormData();
    this.getPosts();
  }

  getPosts = () => {
    const { auth } = this.props;

    getPostFeed(auth.user._id)
      .then(posts => {
        this.setState({ posts });
      })
      .catch(err => console.error(err));
  };

  handleChange = e => {
    let inputValue;

    if (e.target.name === "image") {
      inputValue = e.target.files[0];
    } else {
      inputValue = e.target.value;
    }

    this.postData.set(e.target.name, inputValue);
    this.setState({ [e.target.name]: inputValue });
  };

  handleAddComment = (postId, text) => {
    const comment = { text };
    addComment(postId, comment)
      .then(postData => {
        const updatedPosts = this.state.posts.map(post =>
          post._id === postData._id ? postData : post
        );
        this.setState({ posts: updatedPosts });
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleDeleteComment = (postId, comment) => {
    deleteComment(postId, comment)
      .then(postData => {
        const updatedPosts = this.state.posts.map(post =>
          post._id === postData._id ? postData : post
        );
        this.setState({ posts: updatedPosts });
      })
      .catch(err => {
        console.error(err);
      });
  };

  handleAddPost = () => {
    const { auth } = this.props;
    this.setState({ isAddingPost: true });

    addPost(auth.user._id, this.postData)
      .then(postData => {
        const updatedPosts = [postData, ...this.state.posts];
        this.setState({
          posts: updatedPosts,
          isAddingPost: false,
          text: "",
          image: ""
        });
        this.postData.delete("image");
      })
      .catch(err => {
        console.error(err);
        this.setState({ isAddingPost: false });
      });
  };

  handleDeletePost = deletedPost => {
    this.setState({ isDeleting: true });

    deletePost(deletedPost._id)
      .then(postData => {
        // const postIndex = this.state.posts.findIndex(post=>post._id === postData._id)

        const postList = this.state.posts.filter(
          post => post._id !== postData._id
        );

        this.setState({
          posts: postList,
          isDeleting: false
        });
      })
      .catch(err => {
        console.error(err);
        this.setState({ isDeleting: false });
      });
  };

  handleToggleLike = post => {
    const { auth } = this.props;

    const isPostLiked = post.likes.includes(auth.user._id);
    const sendRequest = isPostLiked ? unlikePost : likePost;

    sendRequest(post._id).then(postData => {
      const updatedPosts = this.state.posts.map(post =>
        post._id === postData._id ? postData : post
      );

      this.setState({ posts: updatedPosts });
    });
  };

  render() {
    const { classes, auth } = this.props;
    const { text, image, isAddingPost, posts, isDeleting } = this.state;

    return (
      <div className={classes.root}>
        <Typography
          variant="h4"
          component="h1"
          color="primary"
          className={classes.title}
        >
          Post Feed
        </Typography>
        <NewPost
          auth={auth}
          text={text}
          image={image}
          handleChange={this.handleChange}
          isAddingPost={isAddingPost}
          handleAddPost={this.handleAddPost}
        />

        {posts &&
          posts.map(post => (
            <Post
              key={post._id}
              auth={auth}
              post={post}
              isDeleting={isDeleting}
              handleDelete={this.handleDeletePost}
              toggleLike={this.handleToggleLike}
              handleAddComment={this.handleAddComment}
              handleDeleteComment={this.handleDeleteComment}
            />
          ))}
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    paddingBottom: theme.spacing.unit * 2
  },
  title: {
    padding: theme.spacing.unit * 2
  }
});

export default withStyles(styles)(PostFeed);
