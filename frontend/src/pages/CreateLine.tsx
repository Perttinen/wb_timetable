import { Alert, Box, Button, Snackbar } from "@mui/material";
import { FieldArray, Form, Formik } from "formik";
import * as Yup from "yup";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { useState } from "react";
import { useAddLineMutation, useGetLinesQuery } from "../redux/lines/linesApi";
import { useNavigate } from "react-router-dom";

import {
  FormSelect,
  FormTextField,
  FormGroupContainer,
  FormMainContainer,
  SaveAndCancelButtons,
} from "../components/SmallOnes";
import { setLines } from "../redux/lines/linesSlice";

const CreateLine = () => {
  const [errorMsg, setErrorMsg] = useState("");

  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  const docks = useAppSelector((state) => state.docks);

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
  });

  type StoppiType = {
    dockId: number;
    delayFromStart: number;
  };

  type RouteFormValuesType = {
    startDockId: number;
    stops: StoppiType[];
    endDockId: number;
  };

  const docksAreUnique = (values: RouteFormValuesType) => {
    const ids: number[] = [];
    ids.push(values.startDockId);
    ids.push(values.endDockId);
    // commented original. Test before remove!
    // for (let i in values.stops) {
    values.stops.forEach((stop) => ids.push(stop.dockId));
    // ids.push(values.stops[i].dockId);
    // }
    const distinctIds = [...new Set(ids)];
    return ids.length === distinctIds.length;
  };

  const [
    addLine,
    // commented for linter.
    // , { isLoading, error }
  ] = useAddLineMutation();

  const { data: linesData, refetch } = useGetLinesQuery();

  const handleSubmit = async (values: RouteFormValuesType) => {
    try {
      console.log(values);
      if (docksAreUnique(values)) {
        const response = await addLine(values).unwrap();
        await refetch();
        if (linesData) dispatch(setLines(linesData));
        console.log("Line added:", response);
      } else {
        setErrorMsg("All docks should be unique!");
      }
    } catch (err) {
      console.error("Failed to add line", err);
    }
  };

  const initialValues: RouteFormValuesType = {
    startDockId: Number(docks[0].id),
    stops: [],
    endDockId: Number(docks[0].id),
  };

  return (
    <Box>
      <FormMainContainer>
        {docks.length > 0 && (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={async (values) => {
              await handleSubmit(values);
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
                          const dock = `stops[${index}].dockId`;
                          const time = `stops[${index}].delayFromStart`;
                          const fieldLabel = `dock`;
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
                                {/* <FormSelect options={docks} name={dock} label={fieldLabel} /> */}
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
                                  {/* <Box display={'flex'} flexDirection={'row'} alignContent={'center'} > */}
                                  <Button
                                    onClick={() => arrayHelpers.remove(index)}
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
                                  {/* </Box> */}
                                </Box>
                              </>
                            </FormGroupContainer>
                          );
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
                <SaveAndCancelButtons
                  submitLabel="create"
                  onCancel={() => navigate("/logged/lines")}
                />
              </Form>
            )}
          </Formik>
        )}
      </FormMainContainer>
      <Snackbar
        open={errorMsg !== ""}
        autoHideDuration={4000}
        onClose={() => setErrorMsg("")}
      >
        <Alert severity="error">{errorMsg}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateLine;
