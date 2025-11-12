import { Box, Button, Typography, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Spinner from "../../components/Spinner";
import { useGetUsersQuery } from "../../redux/api";
import { useNavigate } from "react-router";

const Users = () => {
  const { data: users, isLoading: isLoadingUsers } = useGetUsersQuery();
  const theme = useTheme();
  const navigate = useNavigate();
  const isBusy = isLoadingUsers;

  const handleNewUser = () => {
    void navigate("/logged/users/create");
  };

  const handleUserSelection = (userId: number) => {
    console.log(userId);
  };

  return (
    <>
      {isBusy && <Spinner />}
      {!isLoadingUsers && users && (
        <Box width={"100%"} justifySelf={"center"} sx={{ maxWidth: "md" }}>
          <Box display={"flex"} justifyContent={"center"} width={"100%"}>
            <Typography color={theme.palette.primary.dark} fontSize={"1.8rem"}>
              USERS
            </Typography>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={2}
            sx={{ marginX: 2 }}
          >
            <Button
              onClick={() => handleNewUser()}
              fullWidth
              variant="contained"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                CREATE NEW USER
              </Typography>
            </Button>
            {users.map((user) => (
              <Button
                key={user.id}
                onClick={() => handleUserSelection(user.id)}
                fullWidth
                variant="contained"
              >
                <Grid
                  container
                  direction="row"
                  width={1000}
                  sx={{
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Grid>
                    <Typography>{user.username}</Typography>
                  </Grid>
                  <Grid>
                    <Typography>{user.userlevels.join(" | ")}</Typography>
                  </Grid>
                  <Grid>
                    <Typography>
                      {user.disabled ? "Disabled" : "valid"}
                    </Typography>
                  </Grid>
                </Grid>
              </Button>
            ))}
          </Box>
        </Box>
      )}
    </>
  );
};

export default Users;
