import { useNavigate, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useGetDocksQuery } from "../redux/docks/docksApi";

const Timetables = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedRoute = location.pathname.includes("logged");

  const { data: docks, isLoading } = useGetDocksQuery();

  // useEffect(() => {
  //   if (docks) dispatch(setDocks(docks));
  // }, [docks]);

  const handleSelectTimetable = (dockId: number | null) => {
    const dockTimetablePath = isLoggedRoute
      ? `/logged/timetables/${dockId}`
      : `/timetables/${dockId}`;
    void navigate(dockTimetablePath);
  };

  return (
    <>
      {!isLoading && docks ? (
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
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Timetables;
