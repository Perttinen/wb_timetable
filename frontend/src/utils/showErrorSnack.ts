import { showSnackbar } from "../components/SnackbarProvider"
import { getErrorMessage } from "./getErrorMessage"

const showErrorSnack = (e: unknown) => {
  const message = getErrorMessage(e)
  showSnackbar({ severity: "error", duration: 10000, message })
}

export default showErrorSnack
