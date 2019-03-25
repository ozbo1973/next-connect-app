import { addPost } from "../../lib/api";
import Post from "./Post";
import NewPost from "./NewPost";

import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";

class PostFeed extends React.Component {
  state = {
    posts: [],
    text: "",
    image: "",
    isAddingPost: false
  };

  componentDidMount() {
    this.postData = new FormData();
  }

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

  render() {
    const { classes, auth } = this.props;
    const { text, image, isAddingPost } = this.state;

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
