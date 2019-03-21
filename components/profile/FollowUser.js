import { followUser, unFollowUser } from "../../lib/api";
import Button from "@material-ui/core/Button";

const FollowUser = ({ isFollowing, toggleFollow }) => {
  const request = isFollowing ? unFollowUser : followUser;
  return (
    <Button
      variant="contained"
      color={isFollowing ? "secondary" : "primary"}
      onClick={() => toggleFollow(request)}
    >
      {isFollowing ? "unFollow" : "Follow"}
    </Button>
  );
};

export default FollowUser;
