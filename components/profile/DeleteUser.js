import { deleteUser } from "../../lib/api";
import { signoutUser } from "../../lib/auth";

import IconButton from "@material-ui/core/IconButton";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Delete from "@material-ui/icons/Delete";

class DeleteUser extends React.Component {
  state = {
    open: false,
    isDisabling: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleDeleteUser = () => {
    const { userId } = this.props;
    this.setState({ isDisabling: true });

    deleteUser(userId)
      .then(() => {
        signoutUser(true);
      })
      .catch(err => {
        console.error(err);
        this.setState({ isDisabling: false });
      });
  };
  render() {
    const { open, isDisabling } = this.state;
    return (
      <div>
        <IconButton
          onClick={() => this.setState({ open: true })}
          color="secondary"
        >
          <Delete />
        </IconButton>

        <Dialog open={open} close={() => this.setState({ open: false })}>
          <DialogTitle>Delete Account</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Confirm to delete your account?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClose}>
              Cancel
            </Button>
            <Button
              color="secondary"
              onClick={this.handleDeleteUser}
              disabled={isDisabling}
            >
              {isDisabling ? "Deleting" : "Confirm"}
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default DeleteUser;
