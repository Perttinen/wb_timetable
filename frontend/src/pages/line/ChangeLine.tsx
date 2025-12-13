import { useNavigate, useParams } from "react-router-dom"
import { Box, Typography } from "@mui/material"
import { Form, Formik } from "formik"

import Spinner from "../../components/Spinner"
import {
  FormButtons,
  FormGroupContainer,
  FormMainContainer,
  FormTextField,
} from "../../components/FormComponents"
import { showSnackbar } from "../../components/SnackbarProvider"
import {
  useDeleteLineMutation,
  useGetLineQuery,
  useUpdateLineMutation,
} from "../../redux/api/lineApi"
import showErrorSnack from "../../utils/showErrorSnack"
import { lineTypes } from "../../../../types"

interface IStopdocks {
  stopDocks: { name: string; id: number; delayFromStart: number }[]
}

const ChangeLine = () => {
  const { lineId } = useParams<{ lineId: string }>()

  const [updateLine] = useUpdateLineMutation()
  const [deleteLine] = useDeleteLineMutation()

  const navigate = useNavigate()

  const { data: line, isLoading: isLoadingLine } = useGetLineQuery(
    Number(lineId)
  )

  const handleSubmit = async (values: IStopdocks) => {
    const stops = values.stopDocks.map((dock) => ({
      dockId: dock.id,
      delayFromStart: dock.delayFromStart,
    }))
    if (line && !isLoadingLine) {
      try {
        const payload: lineTypes.TLineRequest = {
          startDockId: line.startDock.id,
          stops,
          endDockId: line.endDock.id,
        }
        const result = await updateLine({
          id: String(line?.id),
          body: payload,
        })
        if (!("error" in result)) {
          const message = `line ${line?.id} succesfully updated`
          showSnackbar({ message, severity: "success", duration: 5000 })
          void navigate("/logged/lines")
        }
      } catch (e) {
        showErrorSnack(e)
      }
    }
  }

  const handleDelete = async (id: number) => {
    try {
      // const result =
      await deleteLine(id).unwrap()
      // if (!("error" in result)) {
      const message = `line ${id} deleted`
      showSnackbar({ message, severity: "success", duration: 5000 })
      void navigate("/logged/lines")
      // }
    } catch (e) {
      showErrorSnack(e)
    }
  }

  const isBusy = isLoadingLine

  return (
    <>
      {isBusy && <Spinner />}
      {!isLoadingLine && line && (
        <FormMainContainer>
          <Formik
            initialValues={{
              stopDocks: line.stopDocks,
            }}
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
                )
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
                onDelete={() => handleDelete(line.id)}
              />
            </Form>
          </Formik>
        </FormMainContainer>
      )}
    </>
  )
}

export default ChangeLine
