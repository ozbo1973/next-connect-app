import Snackbar from "@material-ui/core/Snackbar";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import withStyles from "@material-ui/core/styles/withStyles";

function transition(props) {
  return <Slide direction="up" {...props} />;
}
const ShowDialog = ({
  classes,
  error,
  openError,
  closeSnack,
  openSuccess,
  title,
  contentText,
  actions
}) => {
  return (
    <React.Fragment>
      {error && (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          open={openError}
          onClose={closeSnack}
          autoHideDuration={4000}
          message={<span className={classes.snack}>{error}</span>}
        />
      )}

      <Dialog
        open={openSuccess}
        disableBackdropClick={true}
        TransitionComponent={transition}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{contentText}</DialogContentText>
        </DialogContent>

        {actions && <DialogActions>{actions}</DialogActions>}
      </Dialog>
    </React.Fragment>
  );
};

const styles = theme => ({
  snack: {
    color: theme.palette.secondary.light
  }
});

export default withStyles(styles)(ShowDialog);
