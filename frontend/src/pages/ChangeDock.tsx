import { useNavigate, useParams } from "react-router-dom";

import {
  FormButtons,
  FormGroupContainer,
  FormMainContainer,
  FormTextField,
} from "../components/SmallOnes";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import {
  useChangeDockMutation,
  useDeleteDockMutation,
  useGetDockQuery,
} from "../redux/api";
import { Button } from "@mui/material";

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

  // const initialValues = {
  //   name: dockName,
  // };

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

  const [deleteDock, { error }] = useDeleteDockMutation();
  const handleDelete = async () => {
    try {
      if (dock?.id) {
        const res = await deleteDock(dock.id).unwrap();
        console.log("res: ", res);

        void navigate("/logged/docks");
      }
    } catch (e) {
      // e is likely a FetchBaseQueryError or SerializedError
      if (
        typeof e === "object" &&
        e !== null &&
        "data" in e &&
        typeof e.data === "object" &&
        e.data !== null &&
        "error" in e.data &&
        typeof e.data.error === "object"
      ) {
        const { name, message } = e.data.error as {
          name: string;
          message: string;
        };
        console.error(`Delete failed [${name}]: ${message}`);
      } else {
        console.error("Unexpected error:", e);
      }
    }
  };

  return (
    <>
      {!isLoading && dock ? (
        <FormMainContainer>
          <Formik
            initialValues={{
              name: dock.name,
            }}
            validationSchema={dockSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            <Form>
              <FormGroupContainer>
                <FormTextField label="" name="name" type="inputLabel" />
              </FormGroupContainer>
              <FormButtons
                buttons={["cancel", "delete", "save"]}
                submitLabel="save"
                onCancel={() => navigate("/logged/docks")}
                onDelete={handleDelete}
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
