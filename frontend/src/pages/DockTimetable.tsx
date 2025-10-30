// show 20 next departures by dockName from params

// /logged/timetables/:dockName
// /timetables/:dockName

import { Fragment } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useGetTimetableQuery } from "../redux/timetable/timetableApi";
import { IDepartureForTimetable } from "../../../types";
import Typography from "@mui/material/Typography";
import TableContainer from "@mui/material/TableContainer";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import Stack from "@mui/material/Stack";
import dayjs from "dayjs";
import TableHead from "@mui/material/TableHead";
import Paper from "@mui/material/Paper";
import { useGetDockQuery } from "../redux/docks/docksApi";

const InfoCell = ({
  text,
  borderBottom,
}: {
  text: string;
  borderBottom: "1" | "0";
}) => {
  return (
    <TableCell
      sx={{
        color: "red",
        lineHeight: "inherit",
        fontSize: "inherit",
        borderBottom,
      }}
    >
      {text}
    </TableCell>
  );
};

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
        <InfoCell text="extra" borderBottom="0" />
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
      <TableRow sx={{ lineHeight: "50px", borderBottom: "1" }}>
        <TableCell
          sx={{
            color: "inherit",
            lineHeight: "inherit",
            fontSize: "inherit",
          }}
        >
          {departure.destination.toUpperCase()}
        </TableCell>
        <InfoCell text="cancelled" borderBottom="1" />
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
          color: "inherit",
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
  const { dockId } = useParams<{ dockId: string }>();

  const { data: dock, isLoading: isLoadingDock } = useGetDockQuery(
    Number(dockId)
  );

  const { data: departures, isLoading } = useGetTimetableQuery(String(dockId));

  const url = useLocation();

  const height = url.pathname.includes("logged")
    ? { xs: "calc(100dvh - 56px)", sm: "calc(100vh - 64px)" }
    : { xs: "100dvh" };

  if (departures?.length === 0) {
    return <>{`No upcoming departures from ${dockId}`}</>;
  }

  return (
    <>
      {!isLoading && !isLoadingDock && departures && dock ? (
        <TableContainer
          component={Paper}
          sx={{
            borderRadius: "0",
            bgcolor: "darkblue",
            width: "100%",
            maxWidth: fullwidth ? "100%" : 1200,
            margin: "0 auto",
            height,
          }}
        >
          <Table padding="none" stickyHeader>
            <colgroup>
              <col width="62%" />
              <col width="30%" />
              <col width="8%" />
            </colgroup>
            <TableHead>
              <TableRow sx={{ borderBottom: 0 }}>
                <TableCell
                  colSpan={3}
                  height={50}
                  sx={{
                    color: "lightgrey",
                    fontSize: "2rem",
                    fontWeight: "bold",
                    bgcolor: "darkblue",
                    textAlign: "center",
                  }}
                >
                  {dock.name}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody
              sx={{ color: "lightgoldenrodyellow", fontSize: "1.3rem" }}
            >
              {departures.map((departure, index, arr) => (
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
