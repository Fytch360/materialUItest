import React, { useState } from "react";
import {
  Grid,
  Paper,
  Avatar,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
} from "@material-ui/core";
import Logo from "../assets/images/logo-icon.svg";
import { useForm, Controller } from "react-hook-form";
import { useQueryClient, useQuery, useMutation } from "react-query";
import axios from "axios";

const Login = () => {
  const queryClient = useQueryClient();
  const paperStyle = {
    padding: 20,
    heigth: "70vh",
    width: 280,
    margin: "20px auto",
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm({ mode: "onChange" });
  const [error, setError] = useState("");

  const { mutate } = useMutation(
    (data) => axios.post("http://65.21.178.123/api/v1/users/token/", data),
    {
      onSuccess: (res) => {
        setError("");
        const message = "success";
        localStorage.setItem("token", res.data.access);
      },
      onError: (error) => {
        setError(error.response.data.non_field_errors[0]);
        console.log(error.response.data.non_field_errors[0]);
      },
      onSettled: () => {
        queryClient.invalidateQueries("create");
      },
    }
  );

  const onSubmit = (data) => {
    const login = {
      ...data,
    };
    mutate(login);
  };
  return (
    <Grid>
      <Paper elevation={10} style={paperStyle}>
        <Avatar>
          <img src={Logo} />
        </Avatar>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextField
            error={error}
            helperText={error}
            variant="outlined"
            margin="normal"
            //required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            {...register("email", { required: true })}
          />
          <TextField
            error={error}
            helperText={error}
            variant="outlined"
            margin="normal"
            // required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            {...register("password", { required: true })}
          />
          <FormControlLabel
            control={
              <Controller
                control={control}
                name="remember"
                color="primary"
                defaultValue={false}
                render={({ field }) => <Checkbox />}
              />
            }
            label="Запомнить меня"
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            disabled={!isValid}
          >
            Войти
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                забыли пароль?
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Grid>
  );
};

export default Login;
