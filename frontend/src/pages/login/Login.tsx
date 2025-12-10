import { useDispatch } from "react-redux";
import { Form, Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";

import Spinner from "../../components/Spinner";
import {
  FormButtons,
  FormGroupContainer,
  FormMainContainer,
  FormTextField,
} from "../../components/FormComponents";
import { setCredentials } from "../../redux/authSlice";
import { useLoginMutation } from "../../redux/api/authApi";
import showErrorSnack from "../../utils/showErrorSnack";
import { authTypes } from "../../../../types";

const loginSchema = yup.object({
  username: yup.string().required("Password is required"),
  password: yup.string().required("Password is required"),
});

const Login = () => {
  const navigate = useNavigate();
  const [login, { isLoading: isLogging }] = useLoginMutation();
  const dispatch = useDispatch();

  const handleSubmit = async (values: authTypes.TLoginRequest) => {
    try {
      const result = await login(values).unwrap();
      dispatch(setCredentials({ accessToken: result.token }));
      void navigate("/logged/timetables");
    } catch (e) {
      showErrorSnack(e);
    }
  };

  const isBusy = isLogging;

  return (
    <div>
      {isBusy && <Spinner />}
      <FormMainContainer>
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
            <FormButtons buttons={["save"]} submitLabel="login" />
          </Form>
        </Formik>
      </FormMainContainer>
    </div>
  );
};

export default Login;
