import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useGetLinesQuery } from "../redux/api";
import Spinner from "./Spinner";

interface Props {
  onSelectLine: (lineId: number) => void;
  caption: string;
}

const LineSelector = ({ onSelectLine, caption }: Props) => {
  const theme = useTheme();
  const { data: lines, isLoading: IsLoadingLines } = useGetLinesQuery();

  const isBusy = IsLoadingLines;

  return (
    <>
      {isBusy && <Spinner />}
      {!IsLoadingLines && lines && (
        <Box width={"100%"} justifySelf={"center"} sx={{ maxWidth: "md" }}>
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
      )}
    </>
  );
};

export default LineSelector;
