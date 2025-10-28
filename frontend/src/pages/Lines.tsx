import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";

const Lines = () => {
  const navigate = useNavigate();
  const handleChangeLine = () => {
    void navigate("/logged/lines/change");
  };
  const handleCreateLine = () => {
    void navigate("/logged/lines/create");
  };

  return (
    <Box width={"100%"}>
      <Box display={"flex"} flexDirection={"column"} gap={2} sx={{ margin: 2 }}>
        <Button
          onClick={handleCreateLine}
          fullWidth
          variant="contained"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-center",
          }}
        >
          CREATE LINE
        </Button>
      </Box>
      <Box display={"flex"} flexDirection={"column"} gap={2} sx={{ margin: 2 }}>
        <Button
          onClick={handleChangeLine}
          fullWidth
          variant="contained"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-center",
          }}
        >
          CHANGE LINE
        </Button>
      </Box>
    </Box>
  );
};

export default Lines;
