import { signoutUser } from "../lib/auth";
import ActiveLink from "./ActiveLink";

import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import ShareOutlined from "@material-ui/icons/ShareOutlined";
import withStyles from "@material-ui/core/styles/withStyles";

const Navbar = ({ classes, router, pageProps: { auth } }) => {
  const { user = {} } = auth || {};

  return (
    <AppBar
      className={classes.appBar}
      position={router.pathname === "/" ? "fixed" : "static"}
    >
      <Toolbar>
        <ActiveLink href="/">
          <ShareOutlined className={classes.icon} />
        </ActiveLink>

        <Typography
          variant="h5"
          component="h1"
          className={classes.toolbarTitle}
        >
          <ActiveLink href="/">nextConnect</ActiveLink>
        </Typography>

        {renderAuthButtons(user)}
      </Toolbar>
    </AppBar>
  );
};

const renderAuthButtons = user => {
  return user._id ? (
    <div>
      <Button>
        <ActiveLink href={`/profile/${user._id}`}>Profile</ActiveLink>
      </Button>
      <Button onClick={() => signoutUser(false)} variant="outlined">
        Sign out
      </Button>
    </div>
  ) : (
    <div>
      <Button>
        <ActiveLink href="/signup">Sign up</ActiveLink>
      </Button>
      <Button>
        <ActiveLink href="/signin">Sign in</ActiveLink>
      </Button>
    </div>
  );
};

const styles = theme => ({
  appBar: {
    // z-index 1 higher than the fixed drawer in home page to clip it under the navigation
    zIndex: theme.zIndex.drawer + 1
  },
  toolbarTitle: {
    flex: 1
  },
  icon: {
    marginRight: theme.spacing.unit
  }
});

export default withStyles(styles)(Navbar);
