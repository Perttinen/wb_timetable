import { Navigate, Outlet } from "react-router-dom";
import { RootState } from "../redux/store";
import { useAppSelector } from "../redux/hooks";
import Spinner from "../components/Spinner";

const LoggedLayout = ({
  preferredUserlevel,
}: {
  preferredUserlevel: string;
}) => {
  const user = useAppSelector((state: RootState) => state.loggedUser.user);

  if (!user) {
    return <Spinner />;
  }

  if (!user?.userlevels.includes(preferredUserlevel)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default LoggedLayout;
