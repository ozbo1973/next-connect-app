import Post from "../index/Post";

import AppBar from "@material-ui/core/AppBar";
import Typography from "@material-ui/core/Typography";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

class ProfileTabs extends React.Component {
  state = {
    tab: 0
  };

  handleChange = (e, value) => {
    this.setState({
      tab: value
    });
  };

  render() {
    const { tab } = this.state;
    const {
      posts,
      auth,
      handleAddComment,
      handleDeleteComment,
      handleDeletePost,
      handleToggleLike
    } = this.props;

    return (
      <div>
        <AppBar position="static" color="default">
          <Tabs
            value={tab}
            onChange={this.handleChange}
            indicatorColor="secondary"
            textColor="secondary"
            fullWidth
          >
            <Tab label="Posts" />
            <Tab label="Followers" />
            <Tab label="Following" />
          </Tabs>

          {tab === 0 && (
            <TabContainer>
              {posts.map(post => (
                <Post
                  key={post._id}
                  post={post}
                  auth={auth}
                  handleAddComment={handleAddComment}
                  handleDeleteComment={handleDeleteComment}
                  handleDelete={handleDeletePost}
                  toggleLike={handleToggleLike}
                />
              ))}
            </TabContainer>
          )}
        </AppBar>
      </div>
    );
  }
}

const TabContainer = ({ children }) => {
  return (
    <Typography component="div" style={{ padding: "1em" }}>
      {children}
    </Typography>
  );
};

export default ProfileTabs;
