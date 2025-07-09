import { Navigate } from "react-router-dom";
import { RootState } from "../redux/store";
import { useAppSelector } from "../redux/hooks";

interface RequireUserlevelProps {
  level: string;
  children: React.ReactNode;
}

const RequireUserlevel = ({ level, children }: RequireUserlevelProps) => {
  const user = useAppSelector((state: RootState) => state.loggedUser.user);

  if (!user || !user.userlevels.includes(level)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default RequireUserlevel;
