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
import { useAppDispatch } from "./redux/hooks";
import { useGetDocksQuery } from "./redux/docks/docksApi";
import { useEffect } from "react";
import { setDocks } from "./redux/docks/docksSlice";
import ChangeLineSelector from "./pages/ChangeLineSelector";
import ChangeLine from "./pages/ChangeLine";
import CreateLine from "./pages/CreateLine";

const App = () => {
  const dispatch = useAppDispatch();
  const docks = useGetDocksQuery();

  useEffect(() => {
    if (docks.data) dispatch(setDocks(docks.data));
  }, [docks]);

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/timetables" element={<Timetables />} />

      <Route path="/timetables/:dockName" element={<DockTimetable />} />
      {/* Logged user routes */}
      <Route element={<NavLayout />}>
        <Route element={<LoggedLayout preferredUserlevel="user" />}>
          <Route path="/logged/schedule" element={<Schedule />} />
          <Route path="/logged/schedule/:lineId" element={<ScheduleLine />} />

          <Route path="/logged/timetables" element={<Timetables />} />
          <Route
            path="/logged/timetables/:dockName"
            element={<DockTimetable />}
          />
          <Route path="/logged/docks" element={<Docks />} />
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
