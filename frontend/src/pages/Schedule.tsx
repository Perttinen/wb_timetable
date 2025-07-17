import { ILineReturnable } from "../../../types";
import { useAppSelector } from "../redux/hooks";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";
import ScheduleLine from "./ScheduleLine";

const Schedule = () => {
  const theme = useTheme();
  const lines: ILineReturnable[] = useAppSelector((state) => state.lines);
  const [scheduleLineId, setScheduleLineId] = useState<number | null>(null);
  return (
    <>
      {scheduleLineId ? (
        <ScheduleLine
          lineId={scheduleLineId}
          setScheduleLineId={setScheduleLineId}
        />
      ) : (
        <Box
          sx={{
            maxWidth: "lg",
            width: "100%",
            mx: "auto",
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <Typography color={theme.palette.primary.dark} fontSize={"1.8rem"}>
              SELECT LINE
            </Typography>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={2}
            sx={{ marginX: 2 }}
          >
            {lines.map((line: ILineReturnable) => (
              <Button
                key={line.id}
                onClick={() => setScheduleLineId(line.id)}
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
                </Typography>{" "}
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

export default Schedule;
