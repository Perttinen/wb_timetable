import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import { useGetMeQuery } from "../redux/api";
import Spinner from "../components/Spinner";

const NavLayout = () => {
  const { data: loggedUser, isLoading: isLoadingLoggedUser } = useGetMeQuery();

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
