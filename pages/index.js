import Router from "next/router";
import { authInitialProps } from "../lib/auth";

import PostFeed from "../components/index/PostFeed";
import UserFeed from "../components/index/UserFeed";

import CircularProgress from "@material-ui/core/CircularProgress";
import Drawer from "@material-ui/core/Drawer";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import withStyles from "@material-ui/core/styles/withStyles";

const Index = ({ classes, auth }) => {
  return (
    <main className={classes.root}>
      {auth.user && auth.user._id ? (
        <Grid>
          <Grid item xs={12} sm={12} md={7}>
            <PostFeed />
          </Grid>
          <Grid item className={classes.drawerContainer}>
            <Drawer
              className={classes.drawer}
              variant="permanent"
              anchor="right"
              classes={{
                paper: classes.drawerPaper
              }}
            >
              <UserFeed auth={auth} />
            </Drawer>
          </Grid>
        </Grid>
      ) : (
        <Grid
          justify="center"
          direction="row"
          alignItems="center"
          container
          className={classes.heroContent}
        >
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="textPrimary"
            gutterBottom
          >
            A Better Social Network
          </Typography>

          <Typography
            component="p"
            variant="h6"
            align="center"
            color="textSecondary"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis
            volutpat iaculis risus at posuere. Integer fermentum enim libero, ac
            egestas turpis feugiat ac. In consequat libero nec urna pulvinar
            faucibus. Mauris dapibus quis ipsum vel tempus. Fusce viverra eros
            volutpat varius tincidunt. Duis porta iaculis neque, vel tempor elit
            ullamcorper in. Sed efficitur neque fringilla, convallis sapien ac,
            fringilla ex. Suspendisse vitae ornare neque, sit amet placerat leo.
            Donec tempus justo enim, vel dignissim turpis posuere vitae. Aenean
            porta luctus urna vitae maximus. Nulla sagittis nunc eget erat porta
            mattis. Mauris neque erat, porttitor vitae felis sed, faucibus
            maximus purus.
          </Typography>

          <Button
            className={classes.fabButton}
            variant="extendedFab"
            color="primary"
            onClick={() => Router.push("/signup")}
          >
            Get Started
          </Button>
        </Grid>
      )}
    </main>
  );
};

const styles = theme => ({
  root: {
    paddingTop: theme.spacing.unit * 10,
    paddingLeft: theme.spacing.unit * 5,
    [theme.breakpoints.down("sm")]: {
      paddingRight: theme.spacing.unit * 5
    }
  },
  progressContainer: {
    height: "80vh"
  },
  progress: {
    margin: theme.spacing.unit * 2,
    color: theme.palette.secondary.light
  },
  drawerContainer: {
    [theme.breakpoints.down("sm")]: {
      display: "none"
    }
  },
  drawer: {
    width: 350
  },
  drawerPaper: {
    marginTop: 70,
    width: 350
  },
  fabButton: {
    margin: theme.spacing.unit * 3
  },
  heroContent: {
    maxWidth: 600,
    paddingTop: theme.spacing.unit * 8,
    paddingBottom: theme.spacing.unit * 6,
    margin: "0 auto"
  }
});

Index.getInitialProps = authInitialProps();

export default withStyles(styles)(Index);
