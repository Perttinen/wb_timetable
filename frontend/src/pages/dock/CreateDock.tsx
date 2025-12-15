import { Form, Formik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router"

import {
  FormButtons,
  FormGroupContainer,
  FormMainContainer,
  FormTextField,
} from "../../components/FormComponents"
import { showSnackbar } from "../../components/SnackbarProvider"
import Spinner from "../../components/Spinner"
import { useAddDockMutation } from "../../redux/api/dockApi"
import showErrorSnack from "../../utils/showErrorSnack"

const CreateDock = () => {
  const navigate = useNavigate()
  const [addDock, { isLoading: isAddingDock }] = useAddDockMutation()

  const dockSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, "Name must be 2-15 charecters!")
      .max(15, "Name must be 2-15 charecters!")
      .required("Name is required!"),
  })

  const initialValues = {
    name: "",
  }

  const handleSubmit = async (values: { name: string }) => {
    try {
      await addDock(values).unwrap()
      showSnackbar({
        message: `dock ${values.name} created`,
        duration: 5000,
        severity: "success",
      })
      void navigate("/logged/docks")
    } catch (e) {
      showErrorSnack(e)
    }
  }

  const isBusy = isAddingDock

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
  )
}

export default CreateDock
