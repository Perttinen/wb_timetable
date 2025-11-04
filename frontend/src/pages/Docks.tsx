import { Button, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useNavigate } from "react-router-dom";

import { useGetDocksQuery } from "../redux/api";
import Spinner from "../components/Spinner";

const Docks = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { data: docks, isLoading: isLoadingDocks } = useGetDocksQuery();

  const handleNewDock = () => {
    void navigate("/logged/docks/create");
  };

  const handleDockSelection = (dockId: number | null) => {
    void navigate(`/logged/docks/change/${dockId}`);
  };

  const isBusy = isLoadingDocks;

  return (
    <>
      {isBusy && <Spinner />}
      {!isLoadingDocks && docks && (
        <Box width={"100%"} justifySelf={"center"} sx={{ maxWidth: "md" }}>
          <Box display={"flex"} justifyContent={"center"} width={"100%"}>
            <Typography color={theme.palette.primary.dark} fontSize={"1.8rem"}>
              DOCKS
            </Typography>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={2}
            sx={{ marginX: 2 }}
          >
            <Button
              onClick={() => handleNewDock()}
              fullWidth
              variant="contained"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <Typography
                sx={{
                  fontSize: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <AddCircleOutlineOutlinedIcon fontSize="medium" />
                CREATE NEW DOCK
              </Typography>
            </Button>
            {docks.map((dock) => (
              <Button
                key={dock.id}
                onClick={() => handleDockSelection(dock.id)}
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

export default Docks;
