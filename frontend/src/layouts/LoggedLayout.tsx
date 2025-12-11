import { Navigate, Outlet } from "react-router-dom"

import Spinner from "../components/Spinner"
import { useGetMeQuery } from "../redux/api/authApi"

const LoggedLayout = ({
  preferredUserlevel,
}: {
  preferredUserlevel: string
}) => {
  const { data: user } = useGetMeQuery()

  if (!user) {
    return <Spinner />
  }

  if (!user?.userlevels.includes(preferredUserlevel)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}

export default LoggedLayout
