# WB-LINE

WB-LINE is a scheduling application for **water bus traffic**.  
It consists of two main parts:

- **Management Tool** – for logged‑in users to manage schedules, resources and user accounts.
- **Public Timetable Viewer** – a simple display of upcoming departures, intended for info screens or other public devices.

---

## Getting Started

To create content:

1. Create new docks or use existing ones.
2. Combine docks into a line, or use an existing line.
3. Schedule the line.

---

## Public Timetable (`/timetables`)

- Displays a list of selectable docks.
- Selecting a dock shows its timetable.
- Timetable refreshes automatically every **1 minute**.

---

## Login (`/`)

- Basic login with **username and password**.
- Session expires after **7 days** (new login required).

---

## Management Tool

### Menu Bar

- Responsive design:
  - **xs** → navigation menu
  - **md+** → navigation buttons
- User menu includes:
  - Viewing personal data with change password feature
  - Logging out

---

### Timetables (`/logged/timetables`)

- Same as the public timetable, but with a navigation bar.

---

### Schedule (`/logged/schedule`)

- **Add one start** – Add a single departure for the selected line.
- **Add many starts** – Add multiple departures by selecting weekdays and a date range.
- **Remove starts** – Remove departures within selected time periods and weekdays.
  - _Note: “From time” must be earlier than “To time”._

---

### Docks (`/logged/docks`)

- **Create dock** – Add a new dock with a name.
- **Select dock** – Edit or delete an existing dock.

---

### Lines (`/logged/lines`)

- **Create line** – Select at least a start and end dock.
  - Optional: add stops between start and end.
  - Define minutes from line start to each stop to calculate timetable.
- **Select line** – Edit stop delays or delete the line.

---

### Users (`/logged/users`) – _Admins only_

- **Create user** – Add a new user with username, password, and user level.
- **Select user** – Change user level, disable, or delete a user.

---
