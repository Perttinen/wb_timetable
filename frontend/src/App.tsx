import { Route, Routes } from "react-router-dom";
import Docks from "./pages/Docks";
import Lines from "./pages/Lines";
import Schedule from "./pages/Schedule";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Timetables from "./pages/Timetables";
import NavLayout from "./layouts/NavLayout";
import LoggedLayout from "./layouts/LoggedLayout";

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/timetables" element={<Timetables />} />
      {/* Logged user routes */}
      <Route element={<NavLayout />}>
        <Route element={<LoggedLayout preferredUserlevel="user" />}>
          <Route path="/logged/schedule" element={<Schedule />} />
          <Route path="/logged/timetables" element={<Timetables />} />
          <Route path="/logged/docks" element={<Docks />} />
          <Route path="/logged/lines" element={<Lines />} />
          <Route element={<LoggedLayout preferredUserlevel="admin" />}>
            <Route path="/logged/users" element={<Users />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
