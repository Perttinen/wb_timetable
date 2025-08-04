import { ILineReturnable } from "../../../types";
import { useAppSelector } from "../redux/hooks";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

interface Props {
  onSelectLine: (lineId: number) => void;
  caption: string;
}

const LineSelector = ({ onSelectLine, caption }: Props) => {
  const theme = useTheme();
  const lines: ILineReturnable[] = useAppSelector((state) => state.lines);

  return (
    <Box width={"100%"}>
      <Box display={"flex"} justifyContent={"center"} width={"100%"}>
        <Typography color={theme.palette.primary.dark} fontSize={"1.8rem"}>
          {caption}
        </Typography>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={2}
        sx={{ marginX: 2 }}
      >
        {lines.map((line) => (
          <Button
            key={line.id}
            onClick={() => onSelectLine(line.id)}
            fullWidth
            variant="contained"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <Typography sx={{ fontSize: "1rem" }}>
              {line.startDock.name} - {line.endDock.name}
            </Typography>
            <Typography sx={{ fontSize: "0.8rem" }}>
              {line.stopDocks?.length
                ? `via: ${line.stopDocks
                    .map((stopDock) => stopDock.name)
                    .join(" | ")}`
                : "\u00A0"}
            </Typography>
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default LineSelector;
