import Router from "next/router";
import { signinUser } from "../lib/auth";

import Typography from "@material-ui/core/Typography";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import Button from "@material-ui/core/Button";
import Snackbar from "@material-ui/core/Snackbar";
import Lock from "@material-ui/icons/Lock";
import withStyles from "@material-ui/core/styles/withStyles";

class Signin extends React.Component {
  state = {
    email: "",
    password: "",
    openError: false,
    error: "",
    isLoading: false
  };

  handleOnChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const { email, password } = this.state;
    const user = { email, password };
    this.setState({ isLoading: true, error: "" });
    signinUser(user)
      .then(() => {
        Router.push("/");
      })
      .catch(this.showError);
  };

  handleClose = () => {
    this.setState({ openError: false });
  };

  showError = err => {
    const error = (err.response && err.response.data) || err.message;
    this.setState({ error, openError: true, isLoading: false });
  };

  render() {
    const { classes } = this.props;
    const { openError, error, isLoading } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <Lock />
          </Avatar>
          <Typography variant="h5" component="h1">
            Sign In
          </Typography>

          <form onSubmit={this.handleSubmit} className={classes.form}>
            <FormControl fullWidth>
              <InputLabel htmlFor="email">Email:</InputLabel>
              <Input name="email" type="text" onChange={this.handleOnChange} />
            </FormControl>

            <FormControl fullWidth>
              <InputLabel htmlFor="password">Password:</InputLabel>
              <Input
                name="password"
                type="password"
                onChange={this.handleOnChange}
              />
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              disabled={isLoading}
            >
              {isLoading ? "Siging in..." : "Sign in"}
            </Button>
          </form>
        </Paper>
        {error && (
          <Snackbar
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            open={openError}
            onClose={this.handleClose}
            autoHideDuration={4000}
            message={<span className={classes.snack}>{error}</span>}
          />
        )}
      </div>
    );
  }
}

const styles = theme => ({
  root: {
    width: "auto",
    display: "block",
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up("md")]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto"
    }
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%",
    marginTop: theme.spacing.unit
  },
  submit: {
    marginTop: theme.spacing.unit * 2
  },
  snack: {
    color: theme.palette.protectedTitle
  }
});

export default withStyles(styles)(Signin);
