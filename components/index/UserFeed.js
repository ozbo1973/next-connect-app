import Link from "next/link";
import { getUserFeed, followUser } from "../../lib/api";

import ShowDialog from "../ShowDialog";

import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import AccountBox from "@material-ui/icons/AccountBox";
import withStyles from "@material-ui/core/styles/withStyles";

class UserFeed extends React.Component {
  state = {
    users: [],
    openSuccess: false,
    followMessage: ""
  };

  componentDidMount() {
    const { auth } = this.props;

    getUserFeed(auth.user._id).then(users => {
      console.log(users);
      this.setState({ users });
    });
  }

  handleSnackClose = () => this.setState({ openSuccess: false });

  handleFollow = (user, userIndex) => {
    followUser(user._id).then(user => {
      const updatedUsers = [
        ...this.state.users.slice(0, userIndex),
        ...this.state.users.slice(userIndex + 1)
      ];

      this.setState({
        users: updatedUsers,
        openSuccess: true,
        followMessage: `Now following ${user.name}`
      });
    });
  };

  render() {
    const { classes } = this.props;
    const { users, openSuccess, followMessage } = this.state;
    return (
      <div>
        <Typography variant="h6" component="h2" type="title" align="center">
          Browse Users
        </Typography>
        <Divider />

        <List>
          {users.map((user, i) => (
            <span key={user._id}>
              <ListItem>
                <ListItemAvatar className={classes.avatar}>
                  <Avatar src={user.avatar} />
                </ListItemAvatar>
                <ListItemText primary={user.name} />
                <ListItemSecondaryAction className={classes.follow}>
                  <Link href={`/profile/${user._id}`}>
                    <IconButton
                      color="secondary"
                      variant="contained"
                      className={classes.viewButton}
                    >
                      <AccountBox />
                    </IconButton>
                  </Link>
                  <Button
                    color="secondary"
                    variant="contained"
                    onClick={() => this.handleFollow(user, i)}
                  >
                    follow
                  </Button>
                </ListItemSecondaryAction>
              </ListItem>
            </span>
          ))}
        </List>
        <ShowDialog
          openError={openSuccess}
          openSuccess={false}
          snackSuccess
          error={followMessage}
          closeSnack={this.handleSnackClose}
        />
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    padding: theme.spacing.unit
  },
  avatar: {
    marginRight: theme.spacing.unit
  },
  follow: {
    right: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.primary.light
  },
  viewButton: {
    verticalAlign: "middle"
  }
});

export default withStyles(styles)(UserFeed);
