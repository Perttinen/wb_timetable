import { useAppSelector } from "../redux/hooks";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

const Docks = () => {
  const theme = useTheme();
  const docks = useAppSelector((state) => state.docks);

  return (
    <Box width={"100%"}>
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
        {docks.map((dock) => (
          <Button
            key={dock.id}
            onClick={() => console.log(dock.id)}
            fullWidth
            variant="contained"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography sx={{ fontSize: "1rem" }}>{dock.name}</Typography>
            {/* <Typography sx={{ fontSize: "0.8rem" }}>
              {line.stopDocks?.length
                ? `via: ${line.stopDocks
                    .map((stopDock) => stopDock.name)
                    .join(" | ")}`
                : "\u00A0"}
            </Typography> */}
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default Docks;
