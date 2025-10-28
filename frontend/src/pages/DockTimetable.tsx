// show 20 next departures by dockName from params

// /logged/timetables/:dockName
// /timetables/:dockName

import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { useGetTimetableQuery } from "../redux/timetable/timetableApi";
import { useEffect } from "react";
import { IDepartureForTimetable } from "../../../types";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";

const DepartureWithViaRow = ({
  departure,
}: {
  departure: IDepartureForTimetable;
}) => {
  return (
    <>
      <TableRow sx={{ borderBottom: 0, lineHeight: "30px" }}>
        <TableCell
          sx={{
            color: "inherit",
            borderBottom: "inherit",
            fontSize: "inherit",
          }}
        >
          {departure.destination.toUpperCase()}
        </TableCell>
        <TableCell
          rowSpan={2}
          sx={{
            color: "darkorange",
            borderBottom: "inherit",
            bgcolor: "black",
            fontSize: "inherit",
          }}
        >
          infocell
        </TableCell>
        <TableCell
          rowSpan={2}
          sx={{
            color: "inherit",
            borderBottom: "inherit",
            fontSize: "inherit",
          }}
          width={"15%"}
        >
          {dayjs(departure.startTime)?.format("HH:mm")}
        </TableCell>
      </TableRow>
      <TableRow sx={{ fontSize: "1rem", lineHeight: "20px" }}>
        <TableCell
          sx={{
            color: "inherit",
            lineHeight: "inherit",
            fontSize: "inherit",
          }}
          colSpan={3}
        >
          <Stack direction={"row"}>
            <Typography
              sx={{
                lineHeight: "inherit",
                fontSize: "inherit",
              }}
            >
              via:
            </Typography>
            {departure.via.map((v, i) => (
              <Typography
                sx={{
                  lineHeight: "inherit",
                  fontSize: "inherit",
                }}
                key={i}
                ml={"10px"}
              >
                {v}
              </Typography>
            ))}
          </Stack>
        </TableCell>
      </TableRow>
    </>
  );
};

const DepartureRow = ({ departure }: { departure: IDepartureForTimetable }) => {
  return (
    <>
      <TableRow sx={{ lineHeight: "50px" }}>
        <TableCell
          sx={{
            color: "inherit",
            lineHeight: "inherit",
            fontSize: "inherit",
          }}
        >
          {departure.destination.toUpperCase()}
        </TableCell>
        <TableCell
          sx={{
            color: "darkorange",
            bgcolor: "black",
            lineHeight: "inherit",
            fontSize: "inherit",
          }}
        >
          infocell
        </TableCell>
        <TableCell
          sx={{
            color: "inherit",
            lineHeight: "inherit",
            fontSize: "inherit",
          }}
        >
          {dayjs(departure.startTime)?.format("HH:mm")}
        </TableCell>
      </TableRow>
    </>
  );
};

const DateRow = ({ departure }: { departure: IDepartureForTimetable }) => {
  return (
    <TableRow>
      <TableCell
        colSpan={3}
        align="center"
        sx={{
          lineHeight: "50px",
          color: "magenta",
          fontSize: "inherit",
        }}
      >
        {dayjs(departure.startTime).toDate().toDateString()}
      </TableCell>
    </TableRow>
  );
};

interface Props {
  fullwidth: boolean;
}

const DockTimetable = ({ fullwidth }: Props) => {
  const { dockName } = useParams<{ dockName: string }>();
  const { data: departures, isLoading } = useGetTimetableQuery(dockName!, {
    skip: !dockName,
  });

  const [timetableData, setTimetableData] = useState<
    IDepartureForTimetable[] | []
  >([]);

  useEffect(() => {
    if (departures) setTimetableData(departures);
  }, [departures]);

  if (departures?.length === 0) {
    return <>{`No upcoming departures from ${dockName}`}</>;
  }

  return (
    <>
      {!isLoading && departures ? (
        <TableContainer
          sx={{
            display: "flex",
            flexDirection: "column",
            bgcolor: "black",
            width: "100%",
            maxWidth: fullwidth ? "100%" : 1200,
            margin: "0 auto",
          }}
        >
          <Table padding="none">
            <colgroup>
              <col width="62%" />
              <col width="30%" />
              <col width="8%" />
            </colgroup>
            <TableBody sx={{ color: "yellow", fontSize: "1.3rem" }}>
              {timetableData.map((departure, index, arr) => (
                <Fragment key={index}>
                  {/* print date row when date changes or start is after today   */}
                  {((index > 0 &&
                    dayjs(arr[index - 1].startTime).isBefore(
                      departure.startTime,
                      "day"
                    )) ||
                    (index === 0 &&
                      dayjs(departure.startTime).isAfter(
                        dayjs(Date.now()),
                        "day"
                      ))) && <DateRow departure={departure} />}
                  {/* print row with or without vias */}
                  {departure.via.length !== 0 ? (
                    <DepartureWithViaRow departure={departure} />
                  ) : (
                    <DepartureRow departure={departure} />
                  )}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div>loading</div>
      )}
    </>
  );
};

export default DockTimetable;
