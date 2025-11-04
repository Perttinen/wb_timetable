import { Box, CircularProgress } from "@mui/material";

const Spinner = () => {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
        bgcolor: "transparent",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default Spinner;
