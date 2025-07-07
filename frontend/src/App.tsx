import { Route, Routes } from "react-router";
import Docks from "./pages/Docks";
import Lines from "./pages/Lines";
import Schedule from "./pages/Schedule";
import Login from "./pages/Login";
import Users from "./pages/Users";
import Timetables from "./pages/Timetables";
import NavLayout from "./layouts/NavLayout";

const App = () => {
  return (
    <Routes>
      {/* Public standalone pages */}
      <Route path="/login" element={<Login />} />
      <Route path="/timetables" element={<Timetables />} />

      {/* Routes with AppBar */}
      <Route element={<NavLayout />}>
        <Route path="/logged/schedule" element={<Schedule />} />
        <Route path="/logged/timetables" element={<Timetables />} />
        <Route path="/logged/docks" element={<Docks />} />
        <Route path="/logged/lines" element={<Lines />} />
        <Route path="/logged/users" element={<Users />} />
      </Route>
    </Routes>
  );
};

export default App;
