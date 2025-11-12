import { useNavigate, useParams } from "react-router-dom";
import { useGetLineQuery } from "../../redux/api";
import Spinner from "../../components/Spinner";
import {
  FormButtons,
  FormGroupContainer,
  FormMainContainer,
} from "../../components/SmallOnes";
import { Box, TextField, Typography } from "@mui/material";
import { Form, Formik } from "formik";

const ChangeLine = () => {
  const { lineId } = useParams<{ lineId: string }>();
  const navigate = useNavigate();
  const { data: line, isLoading: isLoadingLine } = useGetLineQuery(
    Number(lineId)
  );

  const isBusy = isLoadingLine;

  // const initialValues = {
  //   startDock: line?.startDock.name || "",
  // };

  return (
    <>
      {isBusy && <Spinner />}
      {!isLoadingLine && line && (
        <FormMainContainer>
          <Formik
            initialValues={{
              startDock: line.startDock.name,
            }}
            // validationSchema={dockSchema}
            onSubmit={() => console.log("submit")}
            enableReinitialize={true}
          >
            <Form>
              <FormGroupContainer>
                <Typography justifySelf={"center"}>
                  START: {line?.startDock.name.toLocaleUpperCase()}
                </Typography>
              </FormGroupContainer>
              <FormGroupContainer>
                {line.stopDocks.map((d, i) => {
                  return (
                    <Box display={"flex"} flexDirection={"row"}>
                      <Typography
                        alignSelf={"center"}
                        marginRight={"4px"}
                        width={"120px"}
                      >
                        {d.name}
                      </Typography>
                      <TextField
                        label={`stop ${i + 1}`}
                        name="name"
                        value={d.delayFromStart}
                        sx={{ bgcolor: "white" }}
                      />
                    </Box>
                  );
                })}
              </FormGroupContainer>
              <FormGroupContainer>
                <Typography justifySelf={"center"}>
                  END: {line?.endDock.name.toLocaleUpperCase()}
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
