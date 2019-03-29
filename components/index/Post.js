import Link from "next/link";
import { formatTimeCreated } from "../../lib/dateFn";

import Comments from "./Comments";

import Badge from "@material-ui/core/Badge";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Comment from "@material-ui/icons/Comment";
import DeleteTwoTone from "@material-ui/icons/DeleteTwoTone";
import Favorite from "@material-ui/icons/Favorite";
import FavoriteBorder from "@material-ui/icons/FavoriteBorder";
import withStyles from "@material-ui/core/styles/withStyles";

class Post extends React.PureComponent {
  state = {
    isLiked: false,
    numLikes: 0,
    comments: []
  };

  componentDidMount() {
    this.setLikes();
    this.setComments();
  }

  componentDidUpdate(prevProps) {
    if (prevProps.post.likes !== this.props.post.likes) {
      this.setLikes();
    }
    if (prevProps.post.comments.length !== this.props.post.lenght) {
      this.setComments();
    }
  }

  setComments = () => this.setState({ comments: this.props.post.comments });

  setLikes = () => {
    const { auth, post } = this.props;
    this.setState({
      isLiked: post.likes.includes(auth.user._id),
      numLikes: post.likes.length
    });
  };

  render() {
    const {
      classes,
      auth,
      post,
      isDeleting,
      handleDelete,
      toggleLike,
      handleAddComment,
      handleDeleteComment
    } = this.props;

    const { numLikes, isLiked, comments } = this.state;
    const isUserPost = post.postedBy._id === auth.user._id;

    return (
      <Card className={classes.card}>
        <CardHeader
          className={classes.cardHeader}
          avatar={<Avatar src={post.postedBy.avatar} />}
          title={
            <Link href={`/profile/${post.postedBy._id}`}>
              <a>{post.postedBy.name} </a>
            </Link>
          }
          action={
            isUserPost && (
              <IconButton
                className={classes.button}
                disabled={isDeleting}
                onClick={() => handleDelete(post)}
              >
                <DeleteTwoTone />
              </IconButton>
            )
          }
          subheader={formatTimeCreated(post.createdAt)}
        />
        <CardContent className={classes.cardContent}>
          <Typography variant="body1" className={classes.text}>
            {post.text}
          </Typography>

          {post.image && (
            <div className={classes.imageContainer}>
              <img className={classes.image} src={post.image} />
            </div>
          )}
        </CardContent>

        <CardActions>
          <IconButton
            className={classes.button}
            onClick={() => toggleLike(post)}
          >
            <Badge badgeContent={numLikes} color="secondary">
              {isLiked ? (
                <Favorite className={classes.favoriteIcon} />
              ) : (
                <FavoriteBorder className={classes.favoriteIcon} />
              )}
            </Badge>
          </IconButton>

          <IconButton className={classes.button}>
            <Badge badgeContent={comments.length} color="primary">
              <Comment className={classes.commentIcon} />
            </Badge>
          </IconButton>
        </CardActions>
        <Divider />

        {/* coments area */}
        <Comments
          handleAddComment={handleAddComment}
          handleDelete={handleDeleteComment}
          auth={auth}
          comments={comments}
          postId={post._id}
        />
      </Card>
    );
  }
}

const styles = theme => ({
  card: {
    marginBottom: theme.spacing.unit * 3
  },
  cardContent: {
    backgroundColor: "white"
  },
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    backgroundColor: "rgba(11, 61, 130, 0.06)"
  },
  imageContainer: {
    textAlign: "center",
    padding: theme.spacing.unit
  },
  image: {
    height: 200
  },
  favoriteIcon: {
    color: theme.palette.favoriteIcon
  },
  commentIcon: {
    color: theme.palette.commentIcon
  }
});

export default withStyles(styles)(Post);
