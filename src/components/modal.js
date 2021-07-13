import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import axios from "axios";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

import MomentUtils from "@date-io/moment";

import { useForm, Controller } from "react-hook-form";
import { useQueryClient, useQuery, useMutation } from "react-query";

export default function FormDialog({ data, taskName, update }) {
  const [open, setOpen] = React.useState(false);
  const [dateAfter, setAfter] = React.useState(null);

  const queryClient = useQueryClient();
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });

  const { mutate } = useMutation(
    (data) =>
      axios.post("http://65.21.178.123/api/v1/tasks", {
        name: data.name,
        text: data.text,
        plan_end_at: dateAfter,
        assignee: "ea46530d-1848-46bb-8993-f7c44447e58b",
      }),
    {
      onSuccess: (res) => {
        update();
      },
      onError: (error) => {},
      onSettled: () => {
        queryClient.invalidateQueries("create");
      },
    }
  );

  const onSubmit = (data) => {
    console.log("NUDA");
    const create = {
      ...data,
    };
    mutate(create);
  };
  return (
    <div>
      <Button variant="contained" color="primary" onClick={handleClickOpen}>
        Создать задачу
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle id="form-dialog-title"> Новая задача </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="name"
              label="Название"
              name="name"
              autoComplete="name"
              autoFocus
              {...register("name", {})}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              id="text"
              label="Текст"
              name="text"
              autoFocus
              {...register("text", {})}
            />

            <MuiPickersUtilsProvider utils={MomentUtils}>
              <KeyboardDatePicker
                disableToolbar
                variant="inline"
                format="DD.MM.YYYY"
                margin="normal"
                id="date-picker-inline"
                label="Дата после"
                value={dateAfter}
                onChange={(e) => setAfter(e)}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </MuiPickersUtilsProvider>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Закрыть
            </Button>
            <Button type="submit" variant="contained" color="primary">
              Создать
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
}
