import { useNavigate, useParams } from "react-router-dom"
import { Box, Typography } from "@mui/material"
import { TimePicker } from "@mui/x-date-pickers"
import dayjs, { Dayjs } from "dayjs"
import isSameOrBefore from "dayjs/plugin/isSameOrBefore"
import isSameOrAfter from "dayjs/plugin/isSameOrAfter"
import { Field, Form, Formik } from "formik"

import {
  FormButtons,
  FormDatePicker,
  FormGroupContainer,
  FormMainContainer,
} from "../../components/FormComponents"
import { showSnackbar } from "../../components/SnackbarProvider"
import Spinner from "../../components/Spinner"
import { useDeleteDeparturesMutation } from "../../redux/api/departureApi"
import { departureTypes } from "../../../../types"
import showErrorSnack from "../../utils/showErrorSnack"

dayjs.extend(isSameOrAfter)
dayjs.extend(isSameOrBefore)

const RemoveStarts = () => {
  const { lineId } = useParams<{ lineId: string }>()
  const [deleteDepartures, { isLoading: isDeletingDepartures }] =
    useDeleteDeparturesMutation()
  const navigate = useNavigate()

  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

  interface FormValues {
    fromDate: Dayjs
    toDate: Dayjs
    fromTime: Dayjs
    toTime: Dayjs
    weekdays: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
    lineId: number | ""
  }

  const initialValues: FormValues = {
    fromDate: dayjs(),
    toDate: dayjs(),
    fromTime: dayjs(),
    toTime: dayjs(),
    weekdays: [false, false, false, false, false, false, false],
    lineId: Number(lineId),
  }

  const combineDateAndTime = (date: dayjs.Dayjs, time: dayjs.Dayjs) =>
    date.hour(time.hour()).minute(time.minute()).second(0).millisecond(0)

  const handleSubmit = async (values: FormValues) => {
    const fromDate = combineDateAndTime(values.fromDate, values.fromTime)
    const toDate = combineDateAndTime(values.toDate, values.toTime).add(
      1,
      "minute"
    )

    const payload: departureTypes.TDeleteDeparturesPayload = {
      lineId: values.lineId as number,
      fromDate: fromDate.toISOString(),
      toDate: toDate.toISOString(),
      fromTime: values.fromTime.format("HH:mm"),
      toTime: values.toTime.format("HH:mm"),
      weekdays: values.weekdays,
    }
    try {
      const result = await deleteDepartures(payload).unwrap()
      const message = `${result} start(s) deleted`
      showSnackbar({ message, severity: "success", duration: 5000 })
      void navigate("/logged/schedule")
    } catch (e) {
      showErrorSnack(e)
    }
  }
  const isBusy = isDeletingDepartures
  return (
    <>
      {isBusy && <Spinner />}
      <FormMainContainer>
        <Formik initialValues={initialValues} onSubmit={handleSubmit}>
          {({ setFieldValue, values }) => (
            <Form>
              <FormGroupContainer>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-around",
                  }}
                >
                  {days.map((d, i) => (
                    <Box
                      key={i}
                      sx={{ display: "flex", flexDirection: "column" }}
                    >
                      <Typography>{d}</Typography>
                      <Field type="checkbox" name={`weekdays[${i}]`} />
                    </Box>
                  ))}
                </Box>
              </FormGroupContainer>
              <FormGroupContainer>
                <Box display={"flex"} flexDirection={"row"}>
                  <FormDatePicker
                    name="fromDate"
                    label="from date"
                    setFieldValue={setFieldValue}
                  />
                  <FormDatePicker
                    name="toDate"
                    label="to date"
                    setFieldValue={setFieldValue}
                  />
                </Box>
              </FormGroupContainer>
              <FormGroupContainer>
                <Box display={"flex"} flexDirection={"row"}>
                  <Field name="fromTime">
                    {() => (
                      <TimePicker
                        label="From time"
                        value={values.fromTime}
                        onChange={(newValue): void => {
                          void setFieldValue("fromTime", newValue)
                        }}
                      />
                    )}
                  </Field>
                  <Field name="toTime">
                    {() => (
                      <TimePicker
                        label="To time"
                        value={values.toTime}
                        onChange={(newValue): void => {
                          void setFieldValue("toTime", newValue)
                        }}
                      />
                    )}
                  </Field>
                </Box>
              </FormGroupContainer>
              <FormButtons
                buttons={["cancel", "delete", "save"]}
                onCancel={() => {
                  void navigate("/logged/schedule")
                }}
                submitLabel="delete"
              />
            </Form>
          )}
        </Formik>
      </FormMainContainer>
    </>
  )
}

export default RemoveStarts
