import { Alert, Avatar, Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { ChangeEvent, FormEvent, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectSignInNormalizeValidationError, signIn } from '@/features/user/user.slice';

interface LoginState {
  username: string;
  password: string;
}

const initState: LoginState = {
  username: '',
  password: '',
};

export function Login()  {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const validationError = useAppSelector(selectSignInNormalizeValidationError);
  const error = useAppSelector((state) => state.user.signInError);

  const [state, setState] = useState<LoginState>(initState);

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  const submitFormHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(signIn(state)).unwrap();
    navigate('/', { replace: true });
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>

        <Typography component="h1" variant="h5">
          Login
        </Typography>

        <Box component="form" onSubmit={submitFormHandler} noValidate sx={{ mt: 1, width: '100%' }}>
          {error && <Alert severity='error'>{error}</Alert>}
          <TextField
            fullWidth
            margin="normal"
            required
            label="Email or username"
            name="username"
            onChange={inputChangeHandler}
            value={state.username}
            error={!!validationError?.username}
            helperText={validationError?.username}
          />

          <TextField
            fullWidth
            margin="normal"
            required
            name="password"
            label="Password"
            type="password"
            onChange={inputChangeHandler}
            value={state.password}
            error={!!validationError?.password}
            helperText={validationError?.password}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Login
          </Button>

          <Grid container>
            <Grid item>
              <Link component={RouterLink} to={'/auth/register'} variant="body2">
                {"Don't have an account? Register"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};
