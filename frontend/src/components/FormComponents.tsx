import { Box, Button, MenuItem, TextField, Typography } from "@mui/material"
import { DatePicker, TimePicker } from "@mui/x-date-pickers"
import { Dayjs } from "dayjs"
import { Field, useField } from "formik"
import { PropsWithChildren } from "react"

type FormButtonsPropsType = {
  onCancel?: (val: boolean) => void
  onDelete?: (val: boolean) => void
  submitLabel: string
  buttons: Array<"cancel" | "delete" | "save">
  disabledOnSubmit?: boolean
}
const FormButtons = (props: FormButtonsPropsType) => {
  const { buttons, submitLabel, onCancel, onDelete, disabledOnSubmit } = props

  return (
    <Box display={"flex"} flexDirection={"row"} justifyContent={"space-evenly"}>
      {props.buttons.includes("delete") && onDelete && (
        <Button
          onClick={() => onDelete(false)}
          variant="contained"
          type="button"
          disabled={disabledOnSubmit}
        >
          delete
        </Button>
      )}
      {buttons.includes("cancel") && onCancel && (
        <Button
          onClick={() => onCancel(false)}
          variant="contained"
          type="reset"
          disabled={disabledOnSubmit}
        >
          cancel
        </Button>
      )}
      {buttons.includes("save") && (
        <Button variant="contained" type="submit" disabled={disabledOnSubmit}>
          {submitLabel}
        </Button>
      )}
    </Box>
  )
}

type FormMainContainerProps = PropsWithChildren<{
  caption?: string
}>
const FormMainContainer = (props: FormMainContainerProps) => {
  return (
    <Box
      width={"100%"}
      justifySelf={"center"}
      sx={{
        border: 1,
        marginBottom: "10px",
        mt: "10px",
        padding: "5px",
        borderRadius: "5px",
        backgroundColor: "lightgray",
        maxWidth: "md",
      }}
    >
      {props.caption && (
        <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
          <Typography fontSize={"1.2rem"}>{props.caption}</Typography>
        </Box>
      )}
      {props.children}
    </Box>
  )
}

type FormGroupContainerProps = PropsWithChildren<{
  caption?: string
}>
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
  )
}

type FormTextFieldProps = {
  name: string
  label: string
  type?: string
}
const FormTextField = (props: FormTextFieldProps) => {
  const [field, meta] = useField(props)
  return (
    <TextField
      {...field}
      {...props}
      margin="normal"
      required
      variant="outlined"
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    />
  )
}

type FormSelectProps<T> = {
  selectKey: keyof T
  selectValue: keyof T
  options: T[]
  name: string
  label: string
}
// const FormSelect = <T extends object>(props: FormSelectProps<T>) => {
const FormSelect = <T extends object>({
  options,
  selectKey,
  selectValue,
  ...props
}: FormSelectProps<T>) => {
  const [field, meta] = useField(props)
  return (
    <TextField
      {...field}
      {...props}
      fullWidth
      required
      select
      margin="normal"
      variant="outlined"
      value={field.value as string | number}
      onChange={field.onChange}
      onBlur={field.onBlur}
      error={meta.touched && Boolean(meta.error)}
      helperText={meta.touched && meta.error}
    >
      {options.map((opt) => (
        <MenuItem
          key={String(opt[selectValue])}
          value={opt[selectValue] as string | number}
        >
          {String(opt[selectKey])}
        </MenuItem>
      ))}
    </TextField>
  )
}

type FormTimeOrDatePickerProps<T> = {
  name: string
  label: string
  setFieldValue: (
    field: string,
    value: React.SetStateAction<T>,
    shouldValidate?: boolean
  ) => void
}
const FormTimePicker = (props: FormTimeOrDatePickerProps<Dayjs | null>) => {
  const [field] = useField<Dayjs | null>(props.name)
  return (
    <Field name={props.name}>
      {() => (
        <TimePicker
          label={props.label}
          value={field.value}
          onChange={(newValue): void => {
            props.setFieldValue(props.name, newValue)
          }}
        />
      )}
    </Field>
  )
}

const FormDatePicker = (props: FormTimeOrDatePickerProps<Dayjs | null>) => {
  const [field] = useField<Dayjs | null>(props.name)
  return (
    <Field name={props.name}>
      {() => (
        <DatePicker
          label={props.label}
          value={field.value}
          onChange={(newValue): void => {
            props.setFieldValue(props.name, newValue)
          }}
        />
      )}
    </Field>
  )
}

export {
  FormButtons,
  FormDatePicker,
  FormGroupContainer,
  FormMainContainer,
  FormSelect,
  FormTextField,
  FormTimePicker,
}
