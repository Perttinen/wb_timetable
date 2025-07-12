import ResponsiveAppBar from "../components/Nav";
import { Outlet } from "react-router-dom";
import useInitialize from "../redux/initialize";

const NavLayout = () => {
  useInitialize();
  return (
    <>
      <ResponsiveAppBar />
      <Outlet />
    </>
  );
};

export default NavLayout;
