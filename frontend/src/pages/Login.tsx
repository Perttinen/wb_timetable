import { useFormik } from "formik";
import * as yup from "yup";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import { useLoginMutation } from "../redux/auth/loginApi";
import { useAppDispatch } from "../redux/hooks";
import { setCredentials } from "../redux/auth/loggedUserSlice";
import { useNavigate } from "react-router-dom";
import { getErrorMessage } from "../utils/getErrorMessage";
import { useTheme } from "@mui/material/styles";

const validationSchema = yup.object({
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
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading, error }] = useLoginMutation();
  const theme = useTheme();
  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const result = await login(values).unwrap();
        localStorage.setItem("token", result.token);
        dispatch(setCredentials(result));
        void navigate("/logged/timetables");
      } catch (err) {
        console.error("Kirjautuminen epäonnistui:", err);
      }
    },
  });

  return (
    <div>
      <form
        style={{
          maxWidth: "400px",
          margin: "100px auto",
          padding: "2rem",
          display: "flex",
          flexDirection: "column",
          gap: "1rem",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        }}
        onSubmit={formik.handleSubmit}
      >
        <TextField
          fullWidth
          id="username"
          name="username"
          label="Username"
          value={formik.values.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.username && Boolean(formik.errors.username)}
          helperText={formik.touched.username && formik.errors.username}
        />
        <TextField
          fullWidth
          id="password"
          name="password"
          label="Password"
          type="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        <Button color="primary" variant="contained" fullWidth type="submit">
          Submit
        </Button>
        {error && <p style={{ color: "red" }}>{getErrorMessage(error)}</p>}
        {isLoading && (
          <p style={{ color: theme.palette.primary.main }}>Logging in...</p>
        )}
      </form>
    </div>
  );
};

export default Login;
