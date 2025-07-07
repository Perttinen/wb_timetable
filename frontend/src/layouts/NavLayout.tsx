import ResponsiveAppBar from "../components/Nav";
import { Outlet } from "react-router-dom";

const NavLayout = () => {
  return (
    <>
      <ResponsiveAppBar />
      <Outlet />
    </>
  );
};

export default NavLayout;
