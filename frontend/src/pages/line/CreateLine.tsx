import { Box, Button } from "@mui/material"
import { FieldArray, Form, Formik } from "formik"
import * as Yup from "yup"
import { useNavigate } from "react-router-dom"

import {
  FormSelect,
  FormTextField,
  FormGroupContainer,
  FormMainContainer,
  FormButtons,
} from "../../components/FormComponents"
import { showSnackbar } from "../../components/SnackbarProvider"
import Spinner from "../../components/Spinner"
import { useGetDocksQuery } from "../../redux/api/dockApi"
import { useAddLineMutation } from "../../redux/api/lineApi"
import showErrorSnack from "../../utils/showErrorSnack"

const CreateLine = () => {
  const navigate = useNavigate()

  const [addLine, { isLoading: isAddingLine }] = useAddLineMutation()

  const { data: docks, isLoading: isLoadingDocks } = useGetDocksQuery()

  const validationSchema = Yup.object().shape({
    startDockId: Yup.number()
      .min(0, "Start point is required!")
      .required("Start point is required!"),
    stops: Yup.array().of(
      Yup.object().shape({
        dockId: Yup.number()
          .min(0, "Stop point can't be empty!")
          .required("Stop point can't be empty!"),
        delayFromStart: Yup.number()
          .min(1, "values 1-3000")
          .max(3000, "values 1-3000")
          .required("Time can't be empty!"),
      })
    ),
    endDockId: Yup.number()
      .min(0, "End point is required!")
      .required("End point is required!"),
  })

  type TStop = {
    dockId: number
    delayFromStart: number
  }

  type TRouteFormValues = {
    startDockId: number
    stops: TStop[]
    endDockId: number
  }

  const docksAreUnique = (values: TRouteFormValues) => {
    const ids: number[] = []
    ids.push(values.startDockId)
    ids.push(values.endDockId)
    values.stops.forEach((stop) => ids.push(stop.dockId))
    const distinctIds = [...new Set(ids)]
    return ids.length === distinctIds.length
  }

  const handleSubmit = async (values: TRouteFormValues) => {
    try {
      if (docksAreUnique(values)) {
        const result = await addLine(values).unwrap()
        if (result) {
          const stops = result.stopDocks?.map((stop) => stop.name).join(" | ")
          const via = stops ? `via: ${stops}` : ""
          const message = `line ${result.startDock.name} - ${result.endDock.name} ${via}  created`
          showSnackbar({ message, severity: "success", duration: 5000 })
          void navigate("/logged/lines")
        }
      } else {
        showSnackbar({
          message: "All docks should be unique!",
          severity: "error",
          duration: 10000,
        })
      }
    } catch (e) {
      showErrorSnack(e)
    }
  }

  const isBusy = isAddingLine || isLoadingDocks

  return (
    <>
      {isBusy && <Spinner />}
      {!isLoadingDocks && docks && (
        <Box>
          <FormMainContainer>
            {docks.length > 0 && (
              <Formik
                initialValues={{
                  startDockId: Number(docks[0].id),
                  stops: [],
                  endDockId: Number(docks[0].id),
                }}
                validationSchema={validationSchema}
                onSubmit={async (values) => {
                  await handleSubmit(values)
                }}
              >
                {(props) => (
                  <Form autoComplete="off">
                    <FormGroupContainer caption="Start point">
                      <FormSelect
                        options={docks}
                        name="startDockId"
                        label="dock"
                        selectKey="name"
                        selectValue="id"
                      />
                    </FormGroupContainer>

                    <FieldArray name="stops">
                      {(arrayHelpers) => (
                        <div>
                          {props.values.stops.length > 0 &&
                            props.values.stops.map((_p, index) => {
                              const dock = `stops[${index}].dockId`
                              const time = `stops[${index}].delayFromStart`
                              const fieldLabel = `dock`
                              return (
                                <FormGroupContainer
                                  key={index}
                                  caption={`Stop point ${index + 1}`}
                                >
                                  <>
                                    <FormSelect
                                      options={docks}
                                      name={dock}
                                      label={fieldLabel}
                                      selectKey="name"
                                      selectValue="id"
                                    />
                                    <Box
                                      display={"flex"}
                                      flexDirection={"row"}
                                      alignItems={"flex-end"}
                                      justifyContent={"space-between"}
                                    >
                                      <FormTextField
                                        type="number"
                                        label="minutes from start"
                                        name={time}
                                      />
                                      <Button
                                        onClick={() =>
                                          arrayHelpers.remove(index)
                                        }
                                        variant="text"
                                        sx={{
                                          overflow: "clip",
                                          marginBottom: "8px",
                                          alignSelf: "center",
                                          whiteSpace: "nowrap",
                                        }}
                                      >
                                        delete
                                      </Button>
                                    </Box>
                                  </>
                                </FormGroupContainer>
                              )
                            })}
                          <Box
                            display={"flex"}
                            flexDirection={"row"}
                            justifyContent={"center"}
                          >
                            <Button
                              onClick={() =>
                                arrayHelpers.push({
                                  dockId: docks[0].id,
                                  delayFromStart: 1,
                                })
                              }
                              variant="contained"
                            >
                              add stop
                            </Button>
                          </Box>
                        </div>
                      )}
                    </FieldArray>
                    <FormGroupContainer caption="End point">
                      <FormSelect
                        options={docks}
                        name="endDockId"
                        label="dock"
                        selectKey="name"
                        selectValue="id"
                      />
                    </FormGroupContainer>
                    <FormButtons
                      buttons={["cancel", "save"]}
                      submitLabel="save"
                      onCancel={() => navigate("/logged/lines")}
                    />
                  </Form>
                )}
              </Formik>
            )}
          </FormMainContainer>
        </Box>
      )}
    </>
  )
}

export default CreateLine
