import { Fragment, useEffect } from "react"
import { useParams, useLocation } from "react-router-dom"
import {
  Typography,
  TableContainer,
  Table,
  TableBody,
  TableRow,
  TableCell,
  Stack,
  TableHead,
  Paper,
} from "@mui/material"
import dayjs from "dayjs"

import { departureTypes } from "../../../../types"
import Spinner from "../../components/Spinner"
import { showSnackbar } from "../../components/SnackbarProvider"
import { useGetDockQuery } from "../../redux/api/dockApi"
import { useGetTimetableQuery } from "../../redux/api/departureApi"

interface Props {
  fullwidth: boolean
}

const baseStyle = {
  color: "lightgoldenrodyellow",
  fontWeight: "bold",
  bgcolor: "#0a0a0a",
  fontSize: "1.3rem",
}

const viaCellStyle = {
  ...baseStyle,
  fontSize: "1rem",
  lineHeight: "20px",
  fontWeight: "1rem",
}

const noBottomStyle = {
  ...baseStyle,
  borderBottom: 0,
}

const basicRowStyle = {
  ...baseStyle,
  lineHeight: "50px",
}

const DockTimetable = ({ fullwidth }: Props) => {
  const { dockId } = useParams<{ dockId: string }>()

  const {
    data: dock,
    isLoading: isLoadingDock,
    error: getDockError,
  } = useGetDockQuery(Number(dockId))

  const {
    data: departures,
    isLoading: isLoadingTimetable,
    refetch: fetchDepartures,
    error: getTimetableError,
  } = useGetTimetableQuery(String(dockId))

  const url = useLocation()

  if (getTimetableError || getDockError) {
    showSnackbar({
      message: "unable to refresh data!",
      severity: "error",
      duration: 60000,
    })
  }

  const height = url.pathname.includes("logged")
    ? { xs: "calc(100dvh - 56px)", sm: "calc(100vh - 64px)" }
    : { xs: "100dvh" }

  useEffect(() => {
    const interval = setInterval(async () => {
      await fetchDepartures()
    }, 20000)
    return () => clearInterval(interval)
  }, [fetchDepartures])

  const isBusy = isLoadingDock || isLoadingTimetable

  return (
    <>
      {isBusy && <Spinner />}
      {!isLoadingTimetable && !isLoadingDock && departures && dock && (
        <TableContainer
          component={Paper}
          sx={{
            ...baseStyle,
            borderRadius: "0",
            width: "100%",
            maxWidth: fullwidth ? "100%" : 1200,
            margin: "0 auto",
            height,
          }}
        >
          <Table padding="none" stickyHeader>
            <colgroup>
              <col />
              <col style={{ width: "60px" }} />
            </colgroup>
            <TableHead>
              <TableRow sx={{ borderBottom: 0 }}>
                <TableCell
                  colSpan={3}
                  height={50}
                  sx={{
                    ...baseStyle,
                    textAlign: "center",
                    fontSize: "2rem",
                  }}
                >
                  {departures?.length === 0
                    ? `No upcoming departures from ${dock.name}`
                    : dock.name}
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
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
      )}
    </>
  )
}

const DepartureWithViaRow = ({
  departure,
}: {
  departure: departureTypes.TDepartureForTimetable
}) => {
  return (
    <>
      <TableRow>
        <TableCell sx={{ ...noBottomStyle, paddingLeft: 1 }}>
          {departure.destination.toUpperCase()}
        </TableCell>
        <TableCell rowSpan={2} sx={{ ...noBottomStyle, paddingRight: 1 }}>
          {dayjs(departure.startTime)?.format("HH:mm")}
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell
          sx={{
            ...viaCellStyle,
            paddingLeft: 1,
          }}
          colSpan={3}
        >
          <Stack direction={"row"}>
            <Typography sx={viaCellStyle}>via:</Typography>
            {departure.via.map((v, i) => (
              <Typography sx={viaCellStyle} key={i} ml={"10px"}>
                {v}
                {i < departure.via.length - 1 && ", "}
              </Typography>
            ))}
          </Stack>
        </TableCell>
      </TableRow>
    </>
  )
}

const DepartureRow = ({
  departure,
}: {
  departure: departureTypes.TDepartureForTimetable
}) => {
  return (
    <>
      <TableRow>
        <TableCell sx={{ ...basicRowStyle, paddingLeft: 1 }}>
          {departure.destination.toUpperCase()}
        </TableCell>
        <TableCell sx={{ ...basicRowStyle, paddingRight: 1 }}>
          {dayjs(departure.startTime)?.format("HH:mm")}
        </TableCell>
      </TableRow>
    </>
  )
}

const DateRow = ({
  departure,
}: {
  departure: departureTypes.TDepartureForTimetable
}) => {
  return (
    <TableRow>
      <TableCell colSpan={3} align="center" sx={basicRowStyle}>
        {dayjs(departure.startTime).toDate().toDateString()}
      </TableCell>
    </TableRow>
  )
}

export default DockTimetable
