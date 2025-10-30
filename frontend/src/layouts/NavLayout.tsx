import { Outlet } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { useGetMeQuery } from "../redux/auth/loginApi";
import { useEffect } from "react";
import { setCredentials } from "../redux/auth/loggedUserSlice";
import Navbar from "../components/Navbar";

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

  // useInitialize();

  return (
    <div>
      <Navbar />
      <Outlet />
    </div>
  );
};

export default NavLayout;
