import Link from "next/link";
import { authInitialProps } from "../lib/auth";
import {
  getUser,
  getUserPosts,
  addComment,
  deleteComment,
  deletePost,
  likePost,
  unlikePost
} from "../lib/api";
import { formatDate } from "../lib/dateFn";

import FollowUser from "../components/profile/FollowUser";
import DeleteUser from "../components/profile/DeleteUser";
import ProfileTab from "../components/profile/ProfileTabs";

import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";
import Divider from "@material-ui/core/Divider";
import Edit from "@material-ui/icons/Edit";
import withStyles from "@material-ui/core/styles/withStyles";

class Profile extends React.Component {
  state = {
    user: null,
    isAuth: false,
    isLoading: true,
    isFollowing: false,
    isDeleting: false,
    posts: []
  };

  componentDidMount() {
    const { userId, auth } = this.props;

    getUser(userId).then(async user => {
      const isAuth = auth.user._id === userId;
      const isFollowing = this.checkFollowing(auth, user);
      await getUserPosts(userId).then(posts => {
        this.setState({
          user,
          posts,
          isAuth,
          isFollowing,
          isLoading: false
        });
      });
    });
  }

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

  checkFollowing = (auth, user) => {
    return (
      user.followers.findIndex(follower => follower._id === auth.user._id) > -1
    );
  };

  toggleFollow = sendRequest => {
    const { userId } = this.props;
    const { isFollowing } = this.state;

    sendRequest(userId)
      .then(() => {
        this.setState({ isFollowing: !isFollowing });
      })
      .catch(err => console.log(err));
  };

  render() {
    const { classes, userId, auth } = this.props;
    const {
      isLoading,
      isFollowing,
      user,
      isAuth,
      isDeleting,
      posts
    } = this.state;
    return (
      <Paper className={classes.root} elevation={4}>
        <Typography
          className={classes.title}
          variant="h5"
          component="h1"
          align="center"
          gutterBottom
        >
          Profile
        </Typography>

        {isLoading ? (
          <div className={classes.progressContainer}>
            <CircularProgress
              className={classes.progress}
              size={55}
              thickness={4}
            />
          </div>
        ) : (
          <List dense>
            <ListItem>
              <ListItemAvatar>
                <Avatar src={user.avatar} className={classes.bigAvatar} />
              </ListItemAvatar>
              <ListItemText primary={user.name} secondary={user.email} />

              {isAuth ? (
                <ListItemSecondaryAction>
                  <Link href="/edit-profile">
                    <a>
                      <IconButton color="primary">
                        <Edit />
                      </IconButton>
                    </a>
                  </Link>
                  <DeleteUser userId={userId} />
                </ListItemSecondaryAction>
              ) : (
                <FollowUser
                  isFollowing={isFollowing}
                  toggleFollow={this.toggleFollow}
                />
              )}
            </ListItem>
            <ListItem>
              <Divider />
              <ListItemText
                primary={user.about}
                secondary={`joined: ${formatDate(user.createdAt)}`}
              />
            </ListItem>

            <ProfileTab
              posts={posts}
              auth={auth}
              user={user}
              handleAddComment={this.handleAddComment}
              handleDeleteComment={this.handleDeleteComment}
              handleDeletePost={this.handleDeletePost}
              handleToggleLike={this.handleToggleLike}
            />
          </List>
        )}
      </Paper>
    );
  }
}

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 3,
    marginTop: theme.spacing.unit * 5,
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
      width: 600
    }
  },
  title: {
    color: theme.palette.primary.main
  },
  progress: {
    margin: theme.spacing.unit * 2
  },
  progressContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: 10
  }
});

Profile.getInitialProps = authInitialProps(true);
export default withStyles(styles)(Profile);
