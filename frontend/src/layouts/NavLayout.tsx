import { Outlet, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useGetMeQuery } from "../redux/api";
import Spinner from "../components/Spinner";
import { useEffect } from "react";

const NavLayout = () => {
  const token = localStorage.getItem("token");
  const { data: loggedUser, isLoading: isLoadingLoggedUser } = useGetMeQuery(
    undefined,
    {
      skip: !token,
    }
  );
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      void navigate("/");
    }
  });

  return (
    <>
      {isLoadingLoggedUser && <Spinner />}
      {!isLoadingLoggedUser && loggedUser && (
        <div>
          <Navbar />
          <Outlet />
        </div>
      )}
    </>
  );
};

export default NavLayout;
