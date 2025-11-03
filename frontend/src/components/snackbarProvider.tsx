import React, { useState, useEffect } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

interface ISnackbarParams {
  message: string;
  severity: AlertColor;
}

let triggerSnackbar: ((params: ISnackbarParams) => void) | null = null;

const setSnackbarTrigger = (fn: (params: ISnackbarParams) => void) => {
  triggerSnackbar = fn;
};

export const showSnackbar = (params: ISnackbarParams) => {
  if (triggerSnackbar) {
    triggerSnackbar(params);
  } else {
    console.warn("Snackbar trigger not set");
  }
};

export const SnackbarProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState<AlertColor>("info");
  const [autoHideDuration, setAutoHideDuration] = useState(1000);

  useEffect(() => {
    setSnackbarTrigger((params: ISnackbarParams) => {
      setMessage(params.message);
      setSeverity(params.severity);
      switch (params.severity) {
        case "error":
          setAutoHideDuration(15000);
          break;
        case "warning":
          setAutoHideDuration(15000);
          break;
        case "info":
          setAutoHideDuration(5000);
          break;
        case "success":
          setAutoHideDuration(5000);
          break;
      }
      setOpen(true);
    });
  }, []);

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
  );
};
