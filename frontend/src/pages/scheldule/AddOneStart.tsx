import { DateTimePicker } from "@mui/x-date-pickers"
import dayjs, { Dayjs } from "dayjs"
import { Field, Form, Formik } from "formik"
import { useNavigate, useParams } from "react-router-dom"

import {
  FormGroupContainer,
  FormMainContainer,
  FormButtons,
} from "../../components/FormComponents"
import { showSnackbar } from "../../components/SnackbarProvider"
import Spinner from "../../components/Spinner"
import { useAddDepartureMutation } from "../../redux/api/departureApi"
import showErrorSnack from "../../utils/showErrorSnack"

const AddOneStart = () => {
  const navigate = useNavigate()
  const { lineId } = useParams<{ lineId: string }>()
  const [addDeparture, { isLoading: isAddingDeparture }] =
    useAddDepartureMutation()

  interface FormValues {
    start: Dayjs
    lineId: number | ""
  }

  const initialValues: FormValues = {
    start: dayjs(),
    lineId: Number(lineId),
  }

  const handleSubmit = async (values: FormValues) => {
    const parsedValues = {
      start: values.start.toDate(),
      lineId: Number(values.lineId),
    }
    try {
      await addDeparture(parsedValues).unwrap()
      showSnackbar({
        message: "start successfully added!",
        severity: "success",
        duration: 5000,
      })
      void navigate("/logged/schedule")
    } catch (e) {
      showErrorSnack(e)
    }
  }

  const isBusy = isAddingDeparture

  return (
    <>
      {isBusy && <Spinner />}
      <FormMainContainer>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ setFieldValue, values }) => (
            <Form>
              <FormGroupContainer>
                <Field name="start">
                  {() => (
                    <DateTimePicker
                      label="Departure Time"
                      value={values.start}
                      onChange={(newValue): void => {
                        void setFieldValue("start", newValue)
                      }}
                    />
                  )}
                </Field>
              </FormGroupContainer>
              <FormButtons
                submitLabel="create"
                onCancel={() => navigate("/logged/schedule")}
                buttons={["save", "cancel"]}
              />
            </Form>
          )}
        </Formik>
      </FormMainContainer>
    </>
  )
}

export default AddOneStart
