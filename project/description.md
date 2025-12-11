# WB-LINE

The project implements a scheduling application for water bus traffic. It consists of two main parts: a management tool for logged‑in users and a public timetable viewer.

The management tool allows users to create and manage schedules, along with the resources on which they are based. It also provides administrators with user management features.

The timetable viewer displays the selected schedule and is intended for use on info screens or other public devices.

To create content, start by creating new docks or using existing ones. Then combine the docks into a line, or use an existing line. Finally, schedule the line.

## Public Timetable (/timetables)

Public view displays a list of selectable docks. Selecting one shows timetable. Timetable refreshes every 1 min.

## Login (/)

Basic login with username and password. New login required after 7 days. Login defaults to (logged/timetables)

## Management Tool

### Menu bar

Responsive menu bar with navmenu(xs) or navbuttons (md) and usermenu. Usermenu is for showing own userdata, changing password and logout.

### Timetables (/logged/timetables)

Same as public but with navbar.

### Schedule (/logged/schedule)

Add one start - Add one start for selected line.

Add many starts - Add several starts easily. Pick weekdays, dates between and add many start times as you wish. "from date" and "to date" are included.

Remove starts - Remove starts in selected time periods in selected weekdays. All dates and times are included. From time must be smaller than To time.

### Docks (/logged/docks)

Create new dock - create new dock with name.

Select dock - delete or make changes to dock.

### Lines (/logged/lines)

Create new line - Select at least start point and end point from existing docks. If there is stops between start and end select add stop, pick dock and give minutes from line start time to start time of stop point. Minutes from start is needed to calculate start times for stop points timetable view.

Select line - Make changes in stop point delay times, or delete line.

### Users (/logged/users), only for admins

Create new user - Create new user with username, password and userlevel.

Select user - Change userlevel, disable user or delete user.

# WB-LINE

WB-LINE is a scheduling application for **water bus traffic**.  
It consists of two main parts:

- **Management Tool** – for logged‑in users to manage schedules, resources, and user accounts.
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
- Default login route: `/logged/timetables`.

---

## Management Tool

### Menu Bar

- Responsive design:
  - **xs** → navigation menu
  - **md+** → navigation buttons
- User menu includes:
  - Viewing personal data
  - Changing password
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
