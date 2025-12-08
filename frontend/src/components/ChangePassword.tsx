import { Form, Formik } from "formik";
import { Box, Modal } from "@mui/material";
import * as Yup from "yup";

import {
  FormGroupContainer,
  FormMainContainer,
  FormTextField,
  FormButtons,
} from "./FormComponents";
import { showSnackbar } from "./SnackbarProvider";
import { getErrorMessage } from "../utils/getErrorMessage";
import Spinner from "./Spinner";
import { useUpdateUserMutation } from "../redux/api/userApi";
import { useCheckPasswordMutation } from "../redux/api/authApi";
import { TUserSafe } from "../../../types/userTypes";

interface IConfirmedPasswords {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export const ChangePassword = ({
  pwChangeDialog,
  setPwChangeDialog,
  user,
}: {
  pwChangeDialog: boolean;
  setPwChangeDialog: (val: boolean) => void;
  user: TUserSafe;
}) => {
  const handleClose = () => {
    setPwChangeDialog(false);
  };

  const passwordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .min(2, "Password must be 6-12 charecters!")
      .max(12, "Password must be 6-12 charecters!")
      .required("Password is required!"),
    newPassword: Yup.string()
      .min(6, "Password must be 6-12 charecters!")
      .max(12, "Password must be 6-12 charecters!")
      .required("New password is required!"),
    confirmPassword: Yup.string()
      .required("Confirmation required!")
      .oneOf([Yup.ref("newPassword")], "Passwords must match"),
  });

  const [updateUser, { isLoading: isUpdatingUser }] = useUpdateUserMutation();
  const [checkPw, { isLoading: isCheckingPw }] = useCheckPasswordMutation();

  const handleSubmit = async (values: IConfirmedPasswords) => {
    const payload = {
      body: { password: values.newPassword },
      id: String(user.id),
    };

    try {
      const pwOk = await checkPw({ password: values.currentPassword });

      if (pwOk.data) {
        await updateUser(payload);
        showSnackbar({
          duration: 5000,
          severity: "success",
          message: "Password updated succesfully",
        });
        setPwChangeDialog(false);
      }
    } catch (e) {
      showSnackbar({
        duration: 10000,
        severity: "error",
        message: getErrorMessage(e),
      });
    }
  };

  const initialValues: IConfirmedPasswords = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const isBusy = isCheckingPw || isUpdatingUser;

  return (
    <>
      {isBusy && <Spinner />}
      <Modal
        open={pwChangeDialog}
        sx={{ position: "absolute", left: "10%", top: "20%", width: "90%" }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            width: "70%",
            border: 1,
            padding: "10px",
            borderRadius: "5px",
          }}
        >
          <FormMainContainer>
            <Formik
              initialValues={initialValues}
              validationSchema={passwordSchema}
              onSubmit={handleSubmit}
            >
              <Form tabIndex={-1}>
                <FormGroupContainer>
                  <>
                    <FormTextField
                      name="currentPassword"
                      label="current password"
                      type="password"
                    />
                    <FormTextField
                      name="newPassword"
                      label="new password"
                      type="password"
                    />
                    <FormTextField
                      name="confirmPassword"
                      label="repeat new password"
                      type="password"
                    />
                  </>
                </FormGroupContainer>
                <FormButtons
                  buttons={["save", "cancel"]}
                  onCancel={handleClose}
                  submitLabel="change password"
                />
              </Form>
            </Formik>
          </FormMainContainer>
        </Box>
      </Modal>
    </>
  );
};
