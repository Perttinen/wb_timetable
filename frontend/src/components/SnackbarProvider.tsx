import React, { useState, useEffect } from "react"
import { Snackbar, Alert, AlertColor } from "@mui/material"

export interface ISnackbarParams {
  message: string
  severity: AlertColor
  duration: number
}

let triggerSnackbar: ((params: ISnackbarParams) => void) | null = null

const setSnackbarTrigger = (fn: (params: ISnackbarParams) => void) => {
  triggerSnackbar = fn
}

export const showSnackbar = (input: ISnackbarParams) => {
  if (triggerSnackbar) {
    triggerSnackbar(input)
  } else {
    console.warn("Snackbar trigger not set")
  }
}

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [open, setOpen] = useState(false)
  const [message, setMessage] = useState("")
  const [severity, setSeverity] = useState<AlertColor>("info")
  const [autoHideDuration, setAutoHideDuration] = useState(1000)

  useEffect(() => {
    setSnackbarTrigger((params: ISnackbarParams) => {
      setMessage(params.message)
      setSeverity(params.severity)
      setAutoHideDuration(params.duration)
      setOpen(true)
    })
  }, [])

  return (
    <>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={autoHideDuration}
        onClose={() => setOpen(false)}
      >
        <Alert
          severity={severity}
          onClose={() => setOpen(false)}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  )
}
