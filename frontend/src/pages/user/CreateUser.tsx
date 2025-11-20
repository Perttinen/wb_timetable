import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import {
  FormButtons,
  FormGroupContainer,
  FormMainContainer,
  FormSelect,
  FormTextField,
} from "../../components/SmallOnes";
import { useAddUserMutation, useGetUserlevelsQuery } from "../../redux/api";
import { showSnackbar } from "../../components/SnackbarProvider";
import Spinner from "../../components/Spinner";
import { getErrorMessage } from "../../utils/getErrorMessage";

const CreateUser = () => {
  const navigate = useNavigate();
  const [addUser, { isLoading: isAddingUser }] = useAddUserMutation();
  const { data: userlevels, isLoading: isLoadingUserlevels } =
    useGetUserlevelsQuery();

  const userSchema = Yup.object().shape({
    username: Yup.string()
      .min(2, "Name must be 2-32 charecters!")
      .max(12, "Name must be 2-32 charecters!")
      .required("Name is required!"),
  });

  interface INewUser {
    username: string;
    password: string;
    userlevel: string;
  }

  const handleSubmit = async (values: INewUser) => {
    const newUser = {
      ...values,
      userlevel: values.userlevel === "admin" ? ["user", "admin"] : ["user"],
    };

    try {
      const result = await addUser(newUser).unwrap();
      if (result) {
        showSnackbar({
          message: `user ${values.username} created`,
          duration: 5000,
          severity: "success",
        });
        void navigate("/logged/users");
      }
    } catch (e) {
      let message = getErrorMessage(e);
      if (message === "Validation error") {
        message = `${newUser.username} already exists`;
      }
      showSnackbar({ severity: "error", duration: 6000, message });
    }
  };

  const isBusy = isAddingUser || isLoadingUserlevels;

  return (
    <>
      {isBusy && <Spinner />}
      {!isAddingUser && !isLoadingUserlevels && userlevels && (
        <FormMainContainer>
          <Formik
            initialValues={{
              username: "",
              password: "",
              userlevel: "",
            }}
            validationSchema={userSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            <Form>
              <FormGroupContainer>
                <FormTextField label="username" name="username" />
              </FormGroupContainer>
              <FormGroupContainer>
                <FormTextField label="password" name="password" />
              </FormGroupContainer>
              <FormGroupContainer>
                <FormSelect
                  options={userlevels}
                  name="userlevel"
                  label="userlevel"
                  selectKey="userlevel"
                  selectValue="userlevel"
                />
              </FormGroupContainer>
              <FormButtons
                buttons={["cancel", "save"]}
                submitLabel="save"
                onCancel={() => navigate("/logged/users")}
              />
            </Form>
          </Formik>
        </FormMainContainer>
      )}
    </>
  );
};

export default CreateUser;
