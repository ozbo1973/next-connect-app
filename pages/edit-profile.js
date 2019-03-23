import { authInitialProps } from "../lib/auth";
import Router from "next/router";
import { getAuthUser, userDataSave } from "../lib/api";

import ShowDialog from "../components/ShowDialog";

import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import Paper from "@material-ui/core/Paper";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import VerifiedUserTwoTone from "@material-ui/icons/VerifiedUserTwoTone";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import CloudUpload from "@material-ui/icons/CloudUpload";
import FaceTwoTone from "@material-ui/icons/FaceTwoTone";
import EditSharp from "@material-ui/icons/EditSharp";
import withStyles from "@material-ui/core/styles/withStyles";

class EditProfile extends React.Component {
  state = {
    _id: "",
    name: "",
    avatar: "",
    email: "",
    about: "",
    avatarPreview: "",
    error: null,
    userUpdated: null,
    openSuccess: false,
    openError: false,
    isSaving: false,
    isLoading: false
  };

  componentDidMount() {
    const { auth } = this.props;
    this.setState({ isLoading: true });
    this.userData = new FormData();

    getAuthUser(auth.user._id)
      .then(user => {
        this.setState({
          ...user,
          isLoading: false
        });
      })
      .catch(err => {
        console.log(err);
        this.setState({ isLoading: false });
      });
  }

  handleChange = e => {
    let inputValue;

    if (e.target.name === "avatar") {
      inputValue = e.target.files[0];
      this.setState({ avatarPreview: this.createImagePreview(inputValue) });
    } else {
      inputValue = e.target.value;
    }

    this.userData.set(e.target.name, inputValue);
    this.setState({ [e.target.name]: inputValue });
  };

  showError = err => {
    const error = (err.response && err.response.data) || err.message;
    this.setState({ error, openError: true, isSaving: false });
  };

  handleClose = () => {
    this.setState({ openError: false });
  };

  createImagePreview = file => URL.createObjectURL(file);

  handleSubmit = e => {
    e.preventDefault();
    this.setState({ isSaving: true });

    userDataSave(this.state._id, this.userData)
      .then(userUpdated => {
        this.setState({ openSuccess: true, userUpdated });
        setTimeout(() => {
          Router.push(`/profile/${this.state._id}`);
        }, 3000);
      })
      .catch(this.showError);
  };

  render() {
    const { classes } = this.props;
    const {
      _id,
      name,
      email,
      about,
      avatar,
      avatarPreview,
      isLoading,
      isSaving,
      error,
      openError,
      openSuccess,
      userUpdated
    } = this.state;

    return (
      <div className={classes.root}>
        <Paper className={classes.paper}>
          <Avatar className={classes.avatar}>
            <EditSharp />
          </Avatar>
          <Typography variant="h5" component="h1">
            Edit Profile
          </Typography>

          <form onSubmit={this.handleSubmit} className={classes.form}>
            {isLoading ? (
              <Avatar className={classes.bigAvatar}>
                <FaceTwoTone />
              </Avatar>
            ) : (
              <Avatar
                src={avatarPreview || avatar}
                className={classes.bigAvatar}
              />
            )}
            <input
              type="file"
              name="avatar"
              id="avatar"
              accept="image/*"
              onChange={this.handleChange}
              className={classes.input}
            />

            <label htmlFor="avatar" className={classes.uploadButton}>
              <Button variant="contained" color="secondary" component="span">
                Upload Image <CloudUpload />
              </Button>
            </label>
            <span className={classes.filename}>{avatar && avatar.name}</span>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="name">Name:</InputLabel>
              <Input
                type="text"
                name="name"
                onChange={this.handleChange}
                value={name}
              />
            </FormControl>

            <FormControl margin="normal" fullWidth>
              <InputLabel htmlFor="about">About:</InputLabel>
              <Input
                type="text"
                name="about"
                onChange={this.handleChange}
                value={about}
              />
            </FormControl>

            <FormControl margin="normal" required fullWidth>
              <InputLabel htmlFor="email">Email:</InputLabel>
              <Input
                type="text"
                name="email"
                onChange={this.handleChange}
                value={email}
              />
            </FormControl>

            <Button
              type="submit"
              color="primary"
              variant="contained"
              disabled={isSaving || isLoading}
              fullWidth
              className={classes.submit}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </form>
        </Paper>
        <ShowDialog
          title={this.renderDialogTitle(classes)}
          error={error}
          openError={openError}
          openSuccess={openSuccess}
          closeSnack={this.handleClose}
          contentText={this.renderDialogContent(userUpdated)}
        />
      </div>
    );
  }

  renderDialogTitle = classes => {
    return (
      <React.Fragment>
        <VerifiedUserTwoTone className={classes.icon} />
        Profile Updated
      </React.Fragment>
    );
  };

  renderDialogContent = user => {
    return (
      <React.Fragment>
        User {user && user.name} has successfully been updated.
      </React.Fragment>
    );
  };
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
  bigAvatar: {
    width: 60,
    height: 60,
    margin: "auto"
  },
  uploadButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    margin: "0.25em"
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: theme.spacing.unit * 2
  },
  signinLink: {
    textDecoration: "none",
    color: "white"
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
    color: theme.palette.secondary.light
  },
  icon: {
    padding: "0px 2px 2px 0px",
    verticalAlign: "middle",
    color: "green"
  },
  input: {
    display: "none"
  }
});

EditProfile.getInitialProps = authInitialProps(true);
export default withStyles(styles)(EditProfile);
