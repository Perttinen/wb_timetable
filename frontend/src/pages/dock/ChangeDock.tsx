import { useNavigate, useParams } from "react-router-dom";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import {
  FormButtons,
  FormGroupContainer,
  FormMainContainer,
  FormTextField,
} from "../../components/SmallOnes";
import {
  useChangeDockMutation,
  useDeleteDockMutation,
  useGetDockQuery,
} from "../../redux/api";
import { showSnackbar } from "../../components/SnackbarProvider";
import Spinner from "../../components/Spinner";

const ChangeDock = () => {
  const { dockId } = useParams<{ dockId: string }>();
  const { data: dock, isLoading: isLoadingDock } = useGetDockQuery(
    Number(dockId)
  );

  const navigate = useNavigate();
  const [changeDock, { isLoading: isChangingDock }] = useChangeDockMutation();
  const [deleteDock, { isLoading: isDeletingDock }] = useDeleteDockMutation();

  const dockSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be 2-32 charecters!")
      .max(32, "Name must be 2-32 charecters!")
      .required("Name is required!"),
  });

  const handleSubmit = async (values: { name: string | null }) => {
    try {
      if (typeof values.name === "string" && dock) {
        const result = await changeDock({
          name: values.name,
          id: dock.id,
        });
        if (!("error" in result)) {
          const message = `dock ${dock.name} changed to ${values.name}`;
          showSnackbar({ message, severity: "success", duration: 5000 });
          void navigate("/logged/docks");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleDelete = async () => {
    try {
      if (dock?.id) {
        const result = await deleteDock(dock.id);
        if (!("error" in result)) {
          const message = `dock ${dock.name} deleted`;
          showSnackbar({ message, severity: "success", duration: 5000 });
          void navigate("/logged/docks");
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  const isBusy = isChangingDock || isDeletingDock || isLoadingDock;

  return (
    <>
      {isBusy && <Spinner />}
      {!isLoadingDock && dock && (
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
      )}
    </>
  );
};

export default ChangeDock;
