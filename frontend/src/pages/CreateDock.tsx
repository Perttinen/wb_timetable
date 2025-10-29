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
import { useAddDockMutation, useGetDocksQuery } from "../redux/docks/docksApi";
import { useAppDispatch } from "../redux/hooks";
import { setDocks } from "../redux/docks/docksSlice";

const CreateDock = () => {
  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [
    addDock,
    // commented for linter.
    // , { isLoading, error }
  ] = useAddDockMutation();

  const dockSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be 2-32 charecters!")
      .max(32, "Name must be 2-32 charecters!")
      .required("Name is required!"),
  });

  const initialValues = {
    name: "",
  };

  const { data: docksData, refetch } = useGetDocksQuery();

  const handleSubmit = async (values: IDockname) => {
    console.log(values.name);
    try {
      //   if (docksAreUnique(values)) {
      const response = await addDock(values).unwrap();
      await refetch();
      if (docksData) dispatch(setDocks(docksData));
      console.log("Dock added:", response);
      //   } else {
      //     setErrorMsg("All docks should be unique!");
      //   }
    } catch (err) {
      console.error("Failed to add dock", err);
    }
  };

  return (
    <FormMainContainer>
      <Formik
        initialValues={initialValues}
        validationSchema={dockSchema}
        onSubmit={async (values) => {
          await handleSubmit(values);
        }}
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
