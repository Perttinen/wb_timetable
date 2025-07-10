import { Route, Routes } from "react-router-dom";
import Docks from "./pages/Docks";
import Lines from "./pages/Lines";
import Schedule from "./pages/Schedule";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Timetables from "./pages/Timetables";
import NavLayout from "./layouts/NavLayout";
import { useAppSelector } from "./redux/hooks";
import ProtectedLayout from "./layouts/ProtectedLayout";

const App = () => {
  const loggedUser = useAppSelector((state) => state.loggedUser);
  console.log(loggedUser);

  const isAdmin = loggedUser?.user?.userlevels?.includes("admin");
  const isUser = loggedUser?.user?.userlevels?.includes("user");

  console.log("admin ", isAdmin);
  console.log("user ", isUser);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/timetables" element={<Timetables />} />
      {/* Protected routes */}
      <Route element={<NavLayout />}>
        <Route element={<ProtectedLayout preferredUserlevel="user" />}>
          <Route path="/logged/schedule" element={<Schedule />} />
          <Route path="/logged/timetables" element={<Timetables />} />
          <Route element={<ProtectedLayout preferredUserlevel="admin" />}>
            <Route path="/logged/docks" element={<Docks />} />
            <Route path="/logged/lines" element={<Lines />} />
            <Route path="/logged/users" element={<Users />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
