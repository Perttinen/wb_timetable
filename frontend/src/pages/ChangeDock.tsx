import { useNavigate, useParams } from "react-router-dom";

import {
  FormGroupContainer,
  FormMainContainer,
  FormTextField,
  SaveAndCancelButtons,
} from "../components/SmallOnes";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useChangeDockMutation, useGetDockQuery } from "../redux/api";

const ChangeDock = () => {
  const { dockId } = useParams<{ dockId: string }>();
  const { data: dock, isLoading } = useGetDockQuery(Number(dockId));

  const navigate = useNavigate();

  const [changeDock] = useChangeDockMutation();

  const dockSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be 2-32 charecters!")
      .max(32, "Name must be 2-32 charecters!")
      .required("Name is required!"),
  });

  const dockName = dock ? dock.name : "";

  const initialValues = {
    name: dockName,
  };

  const handleSubmit = async (values: { name: string | null }) => {
    console.log("sub");

    try {
      if (typeof values.name === "string" && dock) {
        await changeDock({
          name: values.name,
          id: dock.id,
        });
        void navigate("/logged/docks");
      }
    } catch (err) {
      console.error("Failed to change dock", err);
    }
    console.log(values);
  };

  return (
    <>
      {!isLoading && dock ? (
        <FormMainContainer>
          <Formik
            initialValues={initialValues}
            validationSchema={dockSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            <Form>
              <FormGroupContainer>
                <FormTextField label="" name="name" type="inputLabel" />
              </FormGroupContainer>
              <SaveAndCancelButtons
                submitLabel="create"
                onCancel={() => navigate("/logged/docks")}
              />
            </Form>
          </Formik>
        </FormMainContainer>
      ) : (
        <div>loading...</div>
      )}
    </>
  );
};

export default ChangeDock;
