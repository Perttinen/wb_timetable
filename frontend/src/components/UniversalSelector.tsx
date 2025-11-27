import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { Grid } from "@mui/material";

import { dockTypes, userTypes, lineTypes } from "../../../types";

type DockInput = {
  type: "docks";
  data: dockTypes.TDock[];
};

type LineInput = {
  type: "lines";
  data: lineTypes.TLineReturnable[];
};

type UserInput = {
  type: "users";
  data: userTypes.TUserSafe[];
};

interface Props {
  onSelect: (dockId: number) => void;
  onAdd?: { function: () => void; text: string };
  caption: string;
  input: DockInput | LineInput | UserInput;
}

const DockSelector = ({ onAdd, onSelect, caption, input }: Props) => {
  const theme = useTheme();

  const createButtons = () => {
    if (input.type === "docks") {
      return input.data.map((dock) => (
        <Button
          key={dock.id}
          onClick={() => onSelect(dock.id)}
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
      ));
    }
    if (input.type === "lines") {
      return input.data.map((line) => (
        <Button
          key={line.id}
          onClick={() => onSelect(line.id)}
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
      ));
    }
    if (input.type === "users") {
      const getUserlevel = (userlevels: string[]) => {
        if (userlevels.includes("admin")) {
          return "admin";
        }
        return "user";
      };
      return input.data.map((user) => (
        <Button
          key={user.id}
          onClick={() => onSelect(user.id)}
          fullWidth
          variant="contained"
        >
          <Grid
            container
            direction="row"
            width={1000}
            sx={{
              justifyContent: "space-between",
            }}
          >
            <Grid size={4}>
              <Typography justifySelf={"flex-start"}>
                {user.username}
              </Typography>
            </Grid>
            <Grid size={4}>
              <Typography justifySelf={"flex-start"}>
                {getUserlevel(user.userlevels)}
              </Typography>
            </Grid>
            <Grid size={3}>
              <Typography justifySelf={"flex-start"}>
                {user.disabled ? "Disabled" : "valid"}
              </Typography>
            </Grid>
          </Grid>
        </Button>
      ));
    }
  };

  return (
    <Box width={"100%"} justifySelf={"center"} sx={{ maxWidth: "md" }}>
      <Box
        display={"flex"}
        justifyContent={"center"}
        width={"100%"}
        sx={{ display: { md: "none", xs: "flex" } }}
      >
        <Typography color={theme.palette.primary.dark} fontSize={"1.8rem"}>
          {caption}
        </Typography>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={2}
        sx={{ marginTop: { md: 2 }, marginX: 2 }}
      >
        {onAdd && (
          <Button
            onClick={() => onAdd.function()}
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
              {onAdd.text}
            </Typography>
          </Button>
        )}
        {createButtons()}
      </Box>
    </Box>
  );
};

export default DockSelector;
