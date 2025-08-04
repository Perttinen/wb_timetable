import { useNavigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

interface IDock {
  id: number | null;
  name: string | null;
}

const Timetables = () => {
  const theme = useTheme();
  const docks: IDock[] = useAppSelector((state) => state.docks);
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedRoute = location.pathname.includes("logged");

  const handleSelectTimetable = (dockName: string | null) => {
    const dockTimetablePath = isLoggedRoute
      ? `/logged/timetables/${dockName}`
      : `/timetables/${dockName}`;
    void navigate(dockTimetablePath);
  };

  return (
    <Box width={"100%"}>
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
            onClick={() => handleSelectTimetable(dock.name)}
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
  );
};

export default Timetables;
