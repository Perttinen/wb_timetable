import { Form, Formik } from "formik";
import * as yup from "yup";

import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { showSnackbar } from "../../components/SnackbarProvider";
import Spinner from "../../components/Spinner";
import { api, useLoginMutation } from "../../redux/api";
import {
  FormButtons,
  FormGroupContainer,
  FormMainContainer,
  FormTextField,
} from "../../components/SmallOnes";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const loginSchema = yup.object({
  username: yup
    .string()
    .min(3, "Username should be of minimum 3 characters length")
    .required("Password is required"),
  password: yup
    .string()
    .min(4, "Password should be of minimum 4 characters length")
    .required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading: isLogging }] = useLoginMutation();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(api.util.resetApiState());
    localStorage.clear();
  }, []);

  const handleSubmit = async (values: {
    username: string;
    password: string;
  }) => {
    try {
      const result = await login(values).unwrap();
      localStorage.setItem("token", result.token);
      api.util.resetApiState();
      void navigate("/logged/timetables");
    } catch (e) {
      const message = getErrorMessage(e);
      showSnackbar({ message, severity: "error", duration: 10000 });
    }
  };

  const isBusy = isLogging;

  return (
    <div>
      {isBusy && <Spinner />}
      <FormMainContainer caption="login">
        <Formik
          initialValues={{
            username: "",
            password: "",
          }}
          validationSchema={loginSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          <Form>
            <FormGroupContainer>
              <FormTextField
                name="username"
                label="Username"
                type="inputLabel"
              />
            </FormGroupContainer>
            <FormGroupContainer>
              <FormTextField name="password" label="Password" type="password" />
            </FormGroupContainer>
            <FormButtons buttons={["save"]} submitLabel="submit" />
          </Form>
        </Formik>
      </FormMainContainer>
    </div>
  );
};

export default Login;
