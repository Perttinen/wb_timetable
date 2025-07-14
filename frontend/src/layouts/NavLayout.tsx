import ResponsiveAppBar from "../components/Nav";
import { Outlet } from "react-router-dom";
import useInitialize from "../redux/initialize";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useGetMeQuery } from "../redux/auth/loginApi";
import { useEffect } from "react";
import { setCredentials } from "../redux/auth/loggedUserSlice";

const NavLayout = () => {
  const dispatch = useAppDispatch();
  const loggedUser = useAppSelector((state) => state.loggedUser);
  const token = localStorage.getItem("token");
  const { data } = useGetMeQuery(undefined, {
    skip: !token,
  });
  useEffect(() => {
    if (!loggedUser.user && token && data) {
      dispatch(setCredentials({ user: data, token }));
    }
  }, [data, loggedUser, token, dispatch]);

  useInitialize();

  return (
    <>
      <ResponsiveAppBar />
      <Outlet />
    </>
  );
};

export default NavLayout;
