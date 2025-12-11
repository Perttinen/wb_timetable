# WB-LINE

The project implements a scheduling app for water bus traffic. The app has two main parts: a management tool for logged-in users and a public timetable viewer.

The management tool enables the handling of schedules and the resources that serve as their basis. The management tool also includes user management for admins.

Timetable viewer shows the selected timetable. This is supposed to be used as infoscreen or in other devices.

## Public Timetable (/timetables)

Public view displays a list of selectable docks. Selecting one shows timetable. Timetable refreshes every 1 min.

## Login (/)

Basic login with username and password. New login required after 7 days. Login defaults to (logged/timetables)

## Management Tool

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

### Users (/logged/users)

Create new user - Create new user with username, password and userlevel.

Select user - Change userlevel, disable user or delete user.
