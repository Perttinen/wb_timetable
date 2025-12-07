import { useNavigate, useParams } from "react-router-dom";
import { Field, Form, Formik } from "formik";
import { Box, Typography, useTheme } from "@mui/material";

import Spinner from "../../components/Spinner";
import {
  FormButtons,
  FormGroupContainer,
  FormMainContainer,
  FormSelect,
} from "../../components/FormComponents";
import { showSnackbar } from "../../components/SnackbarProvider";
import { getErrorMessage } from "../../utils/getErrorMessage";
import {
  useDeleteUserMutation,
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../redux/api/userApi";
import { useGetUserlevelsQuery } from "../../redux/api/userlevelApi";
import showErrorSnack from "../../utils/showErrorSnack";

const ChangeUser = () => {
  const { userId } = useParams<{ userId: string }>();

  const { data: user, isLoading: isLoadingUser } = useGetUserQuery(
    String(userId)
  );

  const { data: userlevels, isLoading: isLoadingUserlevels } =
    useGetUserlevelsQuery();

  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();

  const [deleteUser, { isLoading: isDeletingUser }] = useDeleteUserMutation();

  const navigate = useNavigate();

  const theme = useTheme();

  interface IFormvalues {
    userlevel: string;
    disabled: boolean;
  }

  const handleSubmit = async (values: IFormvalues) => {
    const body = {
      ...values,
      userlevels: values.userlevel === "admin" ? ["user", "admin"] : ["user"],
    };
    try {
      const result = await updateUser({
        id: String(user?.id),
        body,
      });
      showSnackbar({
        message: `user ${result.data?.username} updated`,
        duration: 5000,
        severity: "success",
      });
      void navigate("/logged/users");
    } catch (e) {
      showErrorSnack(e);
    }
  };

  const handleDelete = async () => {
    try {
      if (user) {
        await deleteUser(user?.id);
        showSnackbar({
          message: `user ${user.username} deleted`,
          duration: 5000,
          severity: "success",
        });
        void navigate("/logged/users");
      }
    } catch (e) {
      const message = getErrorMessage(e);
      showSnackbar({ severity: "error", duration: 6000, message });
    }
  };

  const getUserlevel = (levels: string[]) => {
    if (levels.includes("admin")) {
      return "admin";
    }
    return "user";
  };

  const isBusy =
    isLoadingUser || isLoadingUserlevels || isUpdatingUser || isDeletingUser;

  return (
    <>
      {isBusy && <Spinner />}
      {!isLoadingUser && !isLoadingUserlevels && userlevels && user && (
        <>
          <Box
            width={"100%"}
            justifySelf={"center"}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",

              padding: "5px",

              backgroundColor: "white",
              maxWidth: "md",
              color: theme.palette.primary.main,
              alignContent: "center",
            }}
          >
            <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>
              {user.username}
            </Typography>
          </Box>
          <FormMainContainer>
            <Formik
              initialValues={{
                userlevel: getUserlevel(user.userlevels),
                disabled: user.disabled,
              }}
              onSubmit={handleSubmit}
              enableReinitialize={true}
            >
              <Form>
                <FormGroupContainer>
                  <FormSelect
                    options={userlevels}
                    name="userlevel"
                    label="userlevel"
                    selectKey="userlevel"
                    selectValue="userlevel"
                  />
                </FormGroupContainer>
                <FormGroupContainer>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    <Box sx={{ display: "flex", flexDirection: "row" }}>
                      <Typography>disabled</Typography>
                      <Field type="checkbox" name={`disabled`} />
                    </Box>
                  </Box>
                </FormGroupContainer>
                <FormButtons
                  buttons={["cancel", "save", "delete"]}
                  submitLabel="save"
                  onCancel={() => navigate("/logged/users")}
                  onDelete={handleDelete}
                />
              </Form>
            </Formik>
          </FormMainContainer>
        </>
      )}
    </>
  );
};

export default ChangeUser;
