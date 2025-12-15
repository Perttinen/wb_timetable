import { Box, Button, Typography, useTheme } from "@mui/material"
import dayjs, { Dayjs } from "dayjs"
import { Field, FieldArray, Form, Formik } from "formik"
import { useNavigate, useParams } from "react-router-dom"

import {
  FormDatePicker,
  FormMainContainer,
  FormTimePicker,
  FormGroupContainer,
  FormButtons,
} from "../../components/FormComponents"
import { TInputDeparture } from "../../../../types/departureTypes"
import { showSnackbar } from "../../components/SnackbarProvider"
import Spinner from "../../components/Spinner"
import { useAddManyDeparturesMutation } from "../../redux/api/departureApi"
import { useGetLineQuery } from "../../redux/api/lineApi"
import showErrorSnack from "../../utils/showErrorSnack"

const AddManyStarts = () => {
  const { lineId } = useParams<{ lineId: string }>()

  const navigate = useNavigate()

  const theme = useTheme()

  const [addDepartures, { isLoading: isAddingDepartures }] =
    useAddManyDeparturesMutation()

  const { data: line, isLoading: isLoadingLine } = useGetLineQuery(
    Number(lineId)
  )

  const days = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]

  interface FormValues {
    fromDate: Dayjs
    toDate: Dayjs
    times: Dayjs[]
    weekdays: [boolean, boolean, boolean, boolean, boolean, boolean, boolean]
    lineId: number | ""
  }

  const initialValues: FormValues = {
    fromDate: dayjs(),
    toDate: dayjs(),
    times: [dayjs()],
    weekdays: [false, false, false, false, false, false, false],
    lineId: Number(lineId),
  }

  const createStartList = (values: FormValues): TInputDeparture[] => {
    const startArray = []

    for (
      let start = values.fromDate;
      start.isBefore(values.toDate.add(1, "day"));
      start = start.add(1, "day")
    ) {
      if (values.weekdays[start.subtract(1, "day").day()]) {
        for (const time of values.times) {
          const dateTime = start
            .set("hour", time.hour())
            .set("minute", time.minute())
            .set("second", 0)
          startArray.push({
            start: dateTime.toDate(),
            lineId: Number(values.lineId),
          })
        }
      }
    }

    return startArray
  }

  const handleSubmit = async (values: FormValues) => {
    const starts = createStartList(values)
    try {
      await addDepartures(starts).unwrap()
      showSnackbar({
        message: `${starts.length} starts successfully added!`,
        duration: 5000,
        severity: "success",
      })
      void navigate("/logged/schedule")
    } catch (e) {
      showErrorSnack(e)
    }
  }

  const isBusy = isLoadingLine || isAddingDepartures

  return (
    <>
      {isBusy && <Spinner />}
      {!isLoadingLine && line && (
        <>
          <Box
            width={"100%"}
            justifySelf={"center"}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",

              padding: "5px",

              backgroundColor: "white",
              maxWidth: "md",
              color: theme.palette.primary.main,
              alignContent: "center",
            }}
          >
            <Typography sx={{ fontSize: "1rem", fontWeight: "bold" }}>
              {line.startDock.name} - {line.endDock.name}
            </Typography>
            <Typography sx={{ fontSize: "0.8rem" }}>
              {line.stopDocks?.length
                ? `via: ${line.stopDocks
                    .map((stopDock) => stopDock.name)
                    .join(" | ")}`
                : "\u00A0"}
            </Typography>
          </Box>

          <FormMainContainer>
            <Formik initialValues={initialValues} onSubmit={handleSubmit}>
              {(props) => (
                <Form>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
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
                          setFieldValue={props.setFieldValue}
                        />
                        <FormDatePicker
                          name="toDate"
                          label="to date"
                          setFieldValue={props.setFieldValue}
                        />
                      </Box>
                    </FormGroupContainer>
                    <FormGroupContainer>
                      <FieldArray name="times">
                        {(arrayProps) => (
                          <div>
                            <Box display={"flex"} flexDirection={"column"}>
                              {props.values.times.length > 0 &&
                                props.values.times.map((_p, index) => {
                                  const time = `times[${index}]`
                                  const fieldLabel = `start ${index + 1}`
                                  return (
                                    <Box
                                      key={index}
                                      display={"flex"}
                                      flexDirection={"row"}
                                      justifyContent={"start"}
                                      alignItems={"start"}
                                      marginY={"10px"}
                                    >
                                      <Box
                                        display={"flex"}
                                        flexDirection={"column"}
                                        alignItems={"center"}
                                      >
                                        <FormTimePicker
                                          name={time}
                                          label={fieldLabel}
                                          setFieldValue={props.setFieldValue}
                                        />
                                        {index ===
                                          props.values.times.length - 1 && (
                                          <Button
                                            onClick={() =>
                                              arrayProps.push(dayjs())
                                            }
                                            variant="text"
                                          >
                                            add more starts
                                          </Button>
                                        )}
                                      </Box>
                                      {index > 0 && (
                                        <Button
                                          onClick={() =>
                                            arrayProps.remove(index)
                                          }
                                        >
                                          delete
                                        </Button>
                                      )}
                                    </Box>
                                  )
                                })}
                              <Box
                                display={"flex"}
                                flexDirection={"row"}
                                justifyContent={"center"}
                              ></Box>
                            </Box>
                          </div>
                        )}
                      </FieldArray>
                    </FormGroupContainer>
                    <FormButtons
                      buttons={["save", "cancel"]}
                      submitLabel="create"
                      onCancel={() => navigate("/logged/schedule")}
                    />
                  </Box>
                </Form>
              )}
            </Formik>
          </FormMainContainer>
        </>
      )}
    </>
  )
}

export default AddManyStarts
