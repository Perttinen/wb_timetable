import { useNavigate, useParams } from "react-router-dom";
import {
  useChangeDockMutation,
  useGetDockQuery,
} from "../redux/docks/docksApi";
import {
  FormGroupContainer,
  FormMainContainer,
  FormTextField,
  SaveAndCancelButtons,
} from "../components/SmallOnes";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setDocks } from "../redux/docks/docksSlice";

const ChangeDock = () => {
  const { dockId } = useParams<{ dockId: string }>();
  const { data: dock, isLoading, refetch } = useGetDockQuery(Number(dockId));
  const docks = useAppSelector((state) => state.docks);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const [
    changeDock,
    // commented for linter.
    // , { isLoading, error }
  ] = useChangeDockMutation();

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
        const updatedDock = await changeDock({
          name: values.name,
          id: dock.id,
        }).unwrap();
        dispatch(
          setDocks(
            docks.map((d) => (d.id === updatedDock.id ? updatedDock : d))
          )
        );
        await refetch();
        console.log("Dock changed:", updatedDock);
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
            onSubmit={async (values) => {
              await handleSubmit(values);
            }}
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
