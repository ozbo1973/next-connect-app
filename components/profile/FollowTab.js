import Link from "next/link";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import withStyles from "@material-ui/core/styles/withStyles";

const FollowTab = ({ classes, user }) => (
  <div className={classes.root}>
    <GridList cellHeight={160} className={classes.gridList} cols={4}>
      {user.map(id => (
        <GridListTile style={{ height: 120 }} key={id._id}>
          <Link href={`/profile/${id._id}`}>
            <a>
              <Avatar src={id.avatar} className={classes.bigAvatar} />
              <Typography
                component="h3"
                variant="subtitle1"
                className={classes.tileText}
              >
                {id.name}
              </Typography>
            </a>
          </Link>
        </GridListTile>
      ))}
    </GridList>
  </div>
);

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 2,
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden"
  },
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto"
  },
  gridList: {
    width: 300,
    [theme.breakpoints.up("sm")]: {
      width: 400
    }
  },
  tileText: {
    textAlign: "center",
    marginTop: 10
  }
});

export default withStyles(styles)(FollowTab);
