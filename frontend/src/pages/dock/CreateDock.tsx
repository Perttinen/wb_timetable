import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router";

import {
  FormButtons,
  FormGroupContainer,
  FormMainContainer,
  FormTextField,
} from "../../components/SmallOnes";
import { IDockname } from "../../../../typesFile";
import { useAddDockMutation } from "../../redux/api";
import { showSnackbar } from "../../components/SnackbarProvider";
import Spinner from "../../components/Spinner";
import { getErrorMessage } from "../../utils/getErrorMessage";

const CreateDock = () => {
  const navigate = useNavigate();
  const [addDock, { isLoading: isAddingDock }] = useAddDockMutation();

  const dockSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be 2-32 charecters!")
      .max(32, "Name must be 2-32 charecters!")
      .required("Name is required!"),
  });

  const initialValues = {
    name: "",
  };

  const handleSubmit = async (values: IDockname) => {
    try {
      const result = await addDock(values).unwrap();
      if (result) {
        showSnackbar({
          message: `dock ${values.name} created`,
          duration: 5000,
          severity: "success",
        });
        void navigate("/logged/docks");
      }
    } catch (e) {
      let message = getErrorMessage(e);
      if (message === "Validation error") {
        message = `${values.name} already exists`;
      }
      showSnackbar({ severity: "error", duration: 6000, message });
    }
  };

  const isBusy = isAddingDock;

  return (
    <>
      {isBusy && <Spinner />}
      <FormMainContainer>
        <Formik
          initialValues={initialValues}
          validationSchema={dockSchema}
          onSubmit={handleSubmit}
          enableReinitialize={true}
        >
          <Form>
            <FormGroupContainer>
              <FormTextField label="name" name="name" />
            </FormGroupContainer>
            <FormButtons
              buttons={["cancel", "save"]}
              submitLabel="save"
              onCancel={() => navigate("/logged/docks")}
            />
          </Form>
        </Formik>
      </FormMainContainer>
    </>
  );
};

export default CreateDock;
