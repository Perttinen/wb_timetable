import { Outlet } from "react-router-dom"

import Navbar from "../components/Navbar"
import Spinner from "../components/Spinner"
import { useGetMeQuery } from "../redux/api/authApi"

const NavLayout = () => {
  const { data: loggedUser, isLoading: isLoadingLoggedUser } = useGetMeQuery()
  console.log("test")

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
  )
}

export default NavLayout
