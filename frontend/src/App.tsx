import { Route, Routes } from "react-router-dom"

import Lines from "./pages/line/Lines"

import NavLayout from "./layouts/NavLayout"
import LoggedLayout from "./layouts/LoggedLayout"
import ScheduleLine from "./pages/scheldule/ScheduleLine"
import AddManyStarts from "./pages/scheldule/AddManyStarts"
import Login from "./pages/login/Login"
import Timetables from "./pages/timetable/Timetables"
import DockTimetable from "./pages/timetable/DockTimetable"
import Schedule from "./pages/scheldule/Schedule"
import AddOneStart from "./pages/scheldule/AddOneStart"
import RemoveDepartures from "./pages/scheldule/RemoveDepartures"
import Docks from "./pages/dock/Docks"
import CreateDock from "./pages/dock/CreateDock"
import ChangeDock from "./pages/dock/ChangeDock"
import ChangeLine from "./pages/line/ChangeLine"
import CreateLine from "./pages/line/CreateLine"
import Users from "./pages/user/Users"
import CreateUser from "./pages/user/CreateUser"
import ChangeUser from "./pages/user/ChangeUser"

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
            element={<RemoveDepartures />}
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

          <Route path="/logged/lines/change/:lineId" element={<ChangeLine />} />
          <Route path="/logged/lines/create" element={<CreateLine />} />
          <Route element={<LoggedLayout preferredUserlevel="admin" />}>
            <Route path="/logged/users" element={<Users />} />
            <Route path="/logged/users/create" element={<CreateUser />} />
            <Route
              path="/logged/users/change/:userId"
              element={<ChangeUser />}
            />
          </Route>
        </Route>
      </Route>
    </Routes>
  )
}

export default App
