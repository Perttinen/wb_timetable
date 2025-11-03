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
import { showSnackbar } from "../components/SnackbarProvider";

const ChangeDock = () => {
  const { dockId } = useParams<{ dockId: string }>();
  const { data: dock, isLoading } = useGetDockQuery(Number(dockId));

  const navigate = useNavigate();

  const [changeDock] = useChangeDockMutation();
  const [deleteDock] = useDeleteDockMutation();

  const dockSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be 2-32 charecters!")
      .max(32, "Name must be 2-32 charecters!")
      .required("Name is required!"),
  });

  const handleSubmit = async (values: { name: string | null }) => {
    console.log("sub");
    if (typeof values.name === "string" && dock) {
      const result = await changeDock({
        name: values.name,
        id: dock.id,
      });
      if (!("error" in result)) {
        const message = `dock ${dock.name} changed to ${values.name}`;
        showSnackbar({ message, severity: "success" });
        void navigate("/logged/docks");
      }
    }
  };

  const handleDelete = async () => {
    if (dock?.id) {
      const result = await deleteDock(dock.id);
      if (!("error" in result)) {
        const message = `dock ${dock.name} deleted`;
        showSnackbar({ message, severity: "success" });
        void navigate("/logged/docks");
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
