import { useNavigate, useLocation } from "react-router-dom";
import { Button, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import { useGetDocksQuery } from "../redux/api";

import Spinner from "../components/Spinner";

const Timetables = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: docks, isLoading: isLoadingDocks } = useGetDocksQuery();

  const isLoggedRoute = location.pathname.includes("logged");

  const handleSelectTimetable = (dockId: number | null) => {
    const dockTimetablePath = isLoggedRoute
      ? `/logged/timetables/${dockId}`
      : `/timetables/${dockId}`;
    void navigate(dockTimetablePath);
  };

  const isBusy = isLoadingDocks;

  return (
    <>
      {isBusy && <Spinner />}{" "}
      {!isLoadingDocks && docks && (
        <Box width={"100%"} justifySelf={"center"} sx={{ maxWidth: "md" }}>
          <Box display={"flex"} justifyContent={"center"} width={"100%"}>
            <Typography color={theme.palette.primary.dark} fontSize={"1.8rem"}>
              SELECT DOCK
            </Typography>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={2}
            sx={{ marginX: 2 }}
          >
            {docks.map((dock) => (
              <Button
                key={dock.id}
                onClick={() => handleSelectTimetable(dock.id)}
                fullWidth
                variant="contained"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}
              >
                <Typography sx={{ fontSize: "1rem" }}>{dock.name}</Typography>
              </Button>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Timetables;
