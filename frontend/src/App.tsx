import { Route, Routes } from "react-router-dom";
import Docks from "./pages/Docks";
import Lines from "./pages/Lines";

import Login from "./pages/Login";
import Users from "./pages/Users";
import Timetables from "./pages/Timetables";
import NavLayout from "./layouts/NavLayout";
import LoggedLayout from "./layouts/LoggedLayout";
import ScheduleLine from "./pages/ScheduleLine";
import Schedule from "./pages/Schedule";
import DockTimetable from "./pages/DockTimetable";
import ChangeLineSelector from "./pages/ChangeLineSelector";
import ChangeLine from "./pages/ChangeLine";
import CreateLine from "./pages/CreateLine";
import CreateDock from "./pages/CreateDock";
import ChangeDock from "./pages/ChangeDock";
import RemoveStarts from "./pages/RemoveStarts";
import AddOneStart from "./pages/AddOneStart";
import AddManyStarts from "./pages/AddManyStarts";

//Testing ci pipe

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/timetables" element={<Timetables />} />
      <Route
        path="/timetables/:dockId"
        element={<DockTimetable fullwidth={true} />}
      />
      {/* Logged user routes */}
      <Route element={<NavLayout />}>
        <Route element={<LoggedLayout preferredUserlevel="user" />}>
          <Route path="/logged/schedule" element={<Schedule />} />
          <Route path="/logged/schedule/:lineId" element={<ScheduleLine />} />
          <Route
            path="/logged/schedule/addone/:lineId"
            element={<AddOneStart />}
          />
          <Route
            path="/logged/schedule/addmany/:lineId"
            element={<AddManyStarts />}
          />
          <Route
            path="/logged/schedule/remove/:lineId"
            element={<RemoveStarts />}
          />
          <Route path="/logged/timetables" element={<Timetables />} />
          <Route
            path="/logged/timetables/:dockId"
            element={<DockTimetable fullwidth={false} />}
          />
          <Route path="/logged/docks" element={<Docks />} />
          <Route path="/logged/docks/create" element={<CreateDock />} />
          <Route path="/logged/docks/change/:dockId" element={<ChangeDock />} />
          <Route path="/logged/lines" element={<Lines />} />
          <Route path="/logged/lines/change" element={<ChangeLineSelector />} />
          <Route path="/logged/lines/change/:lineId" element={<ChangeLine />} />
          <Route path="/logged/lines/create" element={<CreateLine />} />
          <Route element={<LoggedLayout preferredUserlevel="admin" />}>
            <Route path="/logged/users" element={<Users />} />
          </Route>
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
