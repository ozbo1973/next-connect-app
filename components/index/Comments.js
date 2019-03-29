import Link from "next/link";
import { formatTimeCreated } from "../../lib/dateFn";

import CardHeader from "@material-ui/core/CardHeader";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import Avatar from "@material-ui/core/Avatar";
import Delete from "@material-ui/icons/Delete";
import withStyles from "@material-ui/core/styles/withStyles";
import { IconButton } from "@material-ui/core";

class Comments extends React.Component {
  state = { text: "" };

  handleChange = e => {
    this.setState({ text: e.target.value });
  };

  handleSubmit = e => {
    const { text } = this.state;
    const { postId, handleAddComment } = this.props;
    e.preventDefault();
    handleAddComment(postId, text);
    this.setState({ text: "" });
  };

  showComment = comment => {
    const { postId, auth, handleDelete, classes } = this.props;
    const isCommentCreator = comment.postedBy._id === auth.user._id;
    return (
      <div>
        <Link href={`/profile/${comment.postedBy._id}`}>
          <a>{comment.postedBy.name} </a>
        </Link>
        <br />
        {comment.text}
        <span className={classes.commentDate}>
          {formatTimeCreated(comment.createdAt)}
          {isCommentCreator && (
            <IconButton className={classes.commentDelete}>
              <Delete
                onClick={() => handleDelete(postId, comment)}
                color="secondary"
              />
            </IconButton>
          )}
        </span>
      </div>
    );
  };

  render() {
    const { classes, auth, postId, comments } = this.props;
    const { text } = this.state;
    return (
      <div className={classes.comments}>
        <CardHeader
          avatar={
            <Avatar src={auth.user.avatar} className={classes.smallAvatar} />
          }
          title={
            <form onSubmit={this.handleSubmit}>
              <FormControl margin="normal" fullWidth required>
                <InputLabel htmlFor="add-comment">Add Comments</InputLabel>
                <Input
                  id="add-comment"
                  name="text"
                  placeholder="add your comments"
                  value={text}
                  onChange={this.handleChange}
                />
              </FormControl>
            </form>
          }
          className={classes.cardHeader}
        />

        {comments.map(comment => (
          <CardHeader
            key={comment._id}
            avatar={
              <Avatar
                src={comment.postedBy.avatar}
                className={classes.smallAvatar}
              />
            }
            title={this.showComment(comment)}
            className={classes.cardHeader}
          />
        ))}
      </div>
    );
  }
}

const styles = theme => ({
  comments: {
    backgroundColor: "rgba(11, 61, 130, 0.06)"
  },
  cardHeader: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  smallAvatar: {
    margin: 10
  },
  commentDate: {
    display: "block",
    color: "gray",
    fontSize: "0.8em"
  },
  commentDelete: {
    fontSize: "1.6em",
    verticalAlign: "middle",
    cursor: "pointer"
  }
});

export default withStyles(styles)(Comments);
