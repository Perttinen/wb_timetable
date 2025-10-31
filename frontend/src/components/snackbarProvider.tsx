import React, { useState, useEffect } from "react";
import { Snackbar, Alert } from "@mui/material";

let triggerSnackbar: ((message: string) => void) | null = null;

const setSnackbarTrigger = (fn: (message: string) => void) => {
  triggerSnackbar = fn;
};

export const showSnackbar = (message: string) => {
  if (triggerSnackbar) {
    triggerSnackbar(message);
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

  useEffect(() => {
    setSnackbarTrigger((msg: string) => {
      setMessage(msg);
      setOpen(true);
    });
  }, []);

  return (
    <>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={5000}
        onClose={() => setOpen(false)}
      >
        <Alert
          severity="error"
          onClose={() => setOpen(false)}
          sx={{ width: "100%" }}
        >
          {message}
        </Alert>
      </Snackbar>
    </>
  );
};
