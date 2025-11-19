import { useNavigate, useParams } from "react-router-dom";
import { useGetLineQuery, useUpdateLineMutation } from "../../redux/api";
import Spinner from "../../components/Spinner";
import {
  FormButtons,
  FormGroupContainer,
  FormMainContainer,
  FormTextField,
} from "../../components/SmallOnes";
import { Box, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import { ILineToAdd, IStopdocks } from "../../../../types";
import { showSnackbar } from "../../components/SnackbarProvider";
import { getErrorMessage } from "../../utils/getErrorMessage";

const ChangeLine = () => {
  const { lineId } = useParams<{ lineId: string }>();

  const [updateLine] = useUpdateLineMutation();

  const navigate = useNavigate();
  const { data: line, isLoading: isLoadingLine } = useGetLineQuery(
    Number(lineId)
  );
  console.log(line);

  const isBusy = isLoadingLine;

  const handleSubmit = async (values: IStopdocks) => {
    const stops = values.stopDocks.map((dock) => ({
      dockId: dock.id,
      delayFromStart: dock.delayFromStart,
    }));
    const payload: ILineToAdd = {
      startDockId: line!.startDock.id,
      stops,
      endDockId: line!.endDock.id,
    };
    try {
      await updateLine({ id: String(line?.id), body: payload });
      const message = `line ${line?.id} succesfully updated`;
      showSnackbar({ message, severity: "success", duration: 5000 });
      void navigate("/logged/lines/change");
    } catch (e) {
      showSnackbar({
        message: getErrorMessage(e),
        severity: "error",
        duration: 10000,
      });
    }
  };

  return (
    <>
      {isBusy && <Spinner />}
      {!isLoadingLine && line && (
        <FormMainContainer>
          <Formik
            initialValues={{
              stopDocks: line.stopDocks,
            }}
            // validationSchema={dockSchema}
            onSubmit={handleSubmit}
            enableReinitialize={true}
          >
            <Form>
              <FormGroupContainer>
                <Typography justifySelf={"center"}>
                  START: {line.startDock.name.toLocaleUpperCase()}
                </Typography>
              </FormGroupContainer>

              {line.stopDocks.map((d, i) => {
                return (
                  <FormGroupContainer key={i}>
                    <Box display={"flex"} flexDirection={"row"}>
                      <Typography
                        alignSelf={"center"}
                        marginRight={"4px"}
                        width={"120px"}
                      >
                        {d.name}
                      </Typography>
                      <FormTextField
                        name={`stopDocks[${i}].delayFromStart`}
                        label={`stop ${i + 1}`}
                        type="number"
                      />
                    </Box>
                  </FormGroupContainer>
                );
              })}

              <FormGroupContainer>
                <Typography justifySelf={"center"}>
                  DESTINATION: {line.endDock.name.toLocaleUpperCase()}
                </Typography>
              </FormGroupContainer>
              <FormButtons
                buttons={["cancel", "save", "delete"]}
                submitLabel="save"
                onCancel={() => navigate("/logged/lines")}
                onDelete={() => console.log("deleted")}
              />
            </Form>
          </Formik>
        </FormMainContainer>
      )}
    </>
  );
};

export default ChangeLine;
