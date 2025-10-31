import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useNavigate } from "react-router-dom";
import { useGetDocksQuery } from "../redux/api";

const Docks = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const { data: docks, isLoading } = useGetDocksQuery();

  const handleNewDock = () => {
    void navigate("/logged/docks/create");
  };

  const handleDockSelection = (dockId: number | null) => {
    void navigate(`/logged/docks/change/${dockId}`);
  };

  return (
    <>
      {!isLoading && docks ? (
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
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
};

export default Docks;
