import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteUserMutation,
  useGetUserlevelsQuery,
  useGetUserQuery,
  useUpdateUserMutation,
} from "../../redux/api";
import Spinner from "../../components/Spinner";
import {
  FormButtons,
  FormGroupContainer,
  FormMainContainer,
  FormSelect,
} from "../../components/SmallOnes";
import { Field, Form, Formik } from "formik";
import { Box, Typography, useTheme } from "@mui/material";
// import * as Yup from "yup";

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

  //   const userSchema = Yup.object().shape({
  //     username: Yup.string()
  //       .min(2, "Name must be 2-12 charecters!")
  //       .max(12, "Name must be 2-12 charecters!")
  //       .required("Name is required!"),
  //   });

  interface IFormvalues {
    userlevel: string;
    disabled: boolean;
  }

  const handleSubmit = async (values: IFormvalues) => {
    await updateUser({
      id: String(user?.id),
      body: {
        ...values,
        userlevels: values.userlevel === "admin" ? ["user", "admin"] : ["user"],
      },
    });
  };

  const handleDelete = async () => {
    if (user) {
      await deleteUser(user?.id);
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
              // validationSchema={dockSchema}
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
