import { Form, Formik } from "formik";
import {
  FormGroupContainer,
  FormMainContainer,
  FormTextField,
  SaveAndCancelButtons,
} from "../components/SmallOnes";
import * as Yup from "yup";
import { useNavigate } from "react-router";
import { IDockname } from "../../../types";
import { useAddDockMutation } from "../redux/docks/docksApi";

const CreateDock = () => {
  const navigate = useNavigate();

  const [addDock] = useAddDockMutation();

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
    console.log(values.name);
    try {
      await addDock(values);
      void navigate("/logged/docks");
    } catch (err) {
      console.error("Failed to add dock", err);
    }
  };

  return (
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
          <SaveAndCancelButtons
            submitLabel="create"
            onCancel={() => navigate("/logged/docks")}
          />
        </Form>
      </Formik>
    </FormMainContainer>
  );
};

export default CreateDock;
