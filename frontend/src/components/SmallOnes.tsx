import { Box, Button, MenuItem, TextField, Typography } from "@mui/material";
import { Field, useField } from "formik";
import { DatePicker, TimePicker } from "@mui/x-date-pickers";
import { PropsWithChildren } from "react";

type TextButtonProps = {
  whenClicked?: () => void;
  buttonType?: "button" | "submit" | "reset" | undefined;
  actionType: "add" | "save" | "cancel" | "trash" | "schedule";
  label: string;
};
const TextButton = (props: TextButtonProps) => {
  const getClicker = () => {
    if (typeof props.whenClicked === "function") {
      return props.whenClicked();
    }
    return void 0;
  };
  const sxValues = {
    borderColor: "",
  };

  switch (props.actionType) {
    case "add":
      break;
    case "cancel":
      break;
    case "save":
      break;
    case "trash":
      sxValues.borderColor = "error.light";
      break;
    case "schedule":
      break;
  }

  return (
    <Button
      variant="outlined"
      type={props.buttonType}
      onClick={getClicker}
      sx={{
        ...sxValues,
        color: "primary.dark",
        paddingX: "4px",
        paddingY: "0px",
        fontSize: "1rem",
      }}
    >
      {props.label}
    </Button>
  );
};

type FormMainContainerProps = PropsWithChildren<{
  caption?: string;
}>;

const FormMainContainer = (props: FormMainContainerProps) => {
  return (
    <Box
      sx={{
        border: 1,
        marginBottom: "10px",
        padding: "5px",
        borderRadius: "5px",
        backgroundColor: "#b0cbf5",
      }}
    >
      {props.caption && (
        <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
          <Typography fontSize={"1.2rem"}>{props.caption}</Typography>
        </Box>
      )}
      {props.children}
    </Box>
  );
};

type FormGroupContainerProps = PropsWithChildren<{
  caption?: string;
}>;
const FormGroupContainer = (props: FormGroupContainerProps) => {
  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      sx={{
        backgroundColor: "white",
        borderWidth: "2px",
        border: 1,
        padding: "10px",
        borderRadius: "5px",
        margin: "5px",
      }}
    >
      {props.caption && (
        <Box display={"flex"} flexDirection={"row"} justifyContent={"start"}>
          <Typography fontSize={"1rem"}>{props.caption}</Typography>
        </Box>
      )}
      {props.children}
    </Box>
  );
};

type FormTextFieldProps = {
  name: string;
  label: string;
  type?: string;
};
const FormTextField = (props: FormTextFieldProps) => {
  const [field, meta] = useField(props);
  return (
    <TextField
      {...field}
      {...props}
      margin="normal"
      name={props.name}
      label={props.label}
      type={props.type}
      required
      variant="outlined"
      value={field.value as string}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  );
};

type FormSelectProps<T> = {
  selectKey: keyof T;
  selectValue: keyof T;
  options: T[];
  name: string;
  label: string;
};
const FormSelect = <T extends object>(props: FormSelectProps<T>) => {
  const [field, meta] = useField(props);

  return (
    <TextField
      fullWidth
      required
      select
      margin="normal"
      variant="outlined"
      name={props.name}
      label={props.label}
      value={field.value as string | number}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    >
      {props.options.map((opt) => (
        <MenuItem
          key={String(opt[props.selectValue])}
          value={opt[props.selectValue] as string | number}
        >
          {String(opt[props.selectKey])}
        </MenuItem>
      ))}
    </TextField>
  );
};

type FormTimeOrDatePickerProps<T> = {
  name: string;
  label: string;
  setFieldValue: (field: string, value: T, shouldValidate?: boolean) => void;
};

const FormTimePicker = <T,>(props: FormTimeOrDatePickerProps<T>) => {
  const [field] = useField(props);

  return (
    <Field name={props.name}>
      {() => (
        <TimePicker
          label={props.label}
          value={field.value as T}
          onChange={(newValue: T | null) => {
            if (newValue) {
              props.setFieldValue(props.name, newValue);
            }
          }}
        />
      )}
    </Field>
  );
};
// type FormTimeOrDatePickerProps = {
//   name: string;
//   label: string;
//   setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
// };

// const FormTimePicker = (props: FormTimeOrDatePickerProps) => {
//   const [field] = useField(props);
//   return (
//     <Field name={props.name}>
//       {() => (
//         <TimePicker
//           label={props.label}
//           value={field.value}
//           onChange={(newValue): void => {
//             props.setFieldValue(props.name, newValue);
//           }}
//         />
//       )}
//     </Field>
//   );
// };

const FormDatePicker = <T,>(props: FormTimeOrDatePickerProps<T>) => {
  const [field] = useField(props);
  return (
    <Field name={props.name}>
      {() => (
        <DatePicker
          label={props.label}
          value={field.value as T}
          onChange={(newValue: T | null): void => {
            if (newValue) {
              props.setFieldValue(props.name, newValue);
            }
          }}
        />
      )}
    </Field>
  );
};
// const FormDatePicker = (props: FormTimeOrDatePickerProps) => {
//   const [field] = useField(props);
//   return (
//     <Field name={props.name}>
//       {() => (
//         <DatePicker
//           label={props.label}
//           value={field.value}
//           onChange={(newValue): void => {
//             props.setFieldValue(props.name, newValue);
//           }}
//         />
//       )}
//     </Field>
//   );
// };

type SaveAndCancelButtonsPropsType = {
  onCancel: (val: boolean) => void;
  submitLabel: string;
};

const SaveAndCancelButtons = (props: SaveAndCancelButtonsPropsType) => {
  return (
    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-evenly"}>
      <Button variant="contained" type="submit">
        {props.submitLabel}
      </Button>
      <Button
        onClick={() => props.onCancel(false)}
        variant="contained"
        type="reset"
      >
        close
      </Button>
    </Box>
  );
};

type topButtonsPropsType = {
  buttons: { onClick: () => void; label: string }[];
};

const TopButtons = (props: topButtonsPropsType) => {
  return (
    <Box
      borderBottom={1}
      zIndex={1000}
      bgcolor={"white"}
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"space-around"}
      alignItems={"center"}
      position={"sticky"}
      top={"65px"}
      sx={{ paddingY: "10px" }}
    >
      {props.buttons.map((b, i) => (
        <Button key={i} variant="contained" onClick={b.onClick}>
          {b.label}
        </Button>
      ))}
    </Box>
  );
};

export {
  FormGroupContainer,
  FormTextField,
  FormSelect,
  FormTimePicker,
  FormDatePicker,
  FormMainContainer,
  SaveAndCancelButtons,
  TextButton,
  TopButtons,
};
