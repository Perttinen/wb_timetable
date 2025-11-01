import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { useNavigate, useParams } from "react-router-dom";

const Lines = () => {
  const navigate = useNavigate();
  const { lineId } = useParams<{ lineId: string }>();

  const handleAddOneStart = () => {
    void navigate(`/logged/schedule/addone/${lineId}`);
  };
  const handleAddManyStarts = () => {
    void navigate(`/logged/schedule/addmany/${lineId}`);
  };
  const handleRemoveStarts = () => {
    void navigate(`/logged/schedule/remove/${lineId}`);
  };

  return (
    <Box width={"100%"} justifySelf={"center"} sx={{ maxWidth: "md" }}>
      <Box display={"flex"} flexDirection={"column"} gap={2} sx={{ margin: 2 }}>
        <Button
          onClick={handleAddOneStart}
          fullWidth
          variant="contained"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-center",
          }}
        >
          add one
        </Button>
        <Button
          onClick={handleAddManyStarts}
          fullWidth
          variant="contained"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-center",
          }}
        >
          add many
        </Button>
      </Box>
      <Box display={"flex"} flexDirection={"column"} gap={2} sx={{ margin: 2 }}>
        <Button
          onClick={handleRemoveStarts}
          fullWidth
          variant="contained"
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-center",
          }}
        >
          remove
        </Button>
      </Box>
    </Box>
  );
};

export default Lines;
