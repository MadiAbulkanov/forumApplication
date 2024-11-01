import { Container, Box, Avatar, Typography, Button, Grid, Link, TextField } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { ChangeEvent, FormEvent, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { selectSignUpNormalizeValidationError, signUp } from '@/features/user/user.slice';

interface UserState {
  username: string;
  password: string;
}

export function Register() {
  const dispatch = useAppDispatch();
  const validationErrors = useAppSelector(selectSignUpNormalizeValidationError);

  const navigate = useNavigate();
  const [state, setState] = useState<UserState>({ 
    password: '', 
    username: '', 
});

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prev) => ({ ...prev, [name]: value }));
  };

  const formSubmitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await dispatch(signUp({ ...state })).unwrap();
    navigate('/');
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
          Register
        </Typography>

        <Box component="form" onSubmit={formSubmitHandler} noValidate sx={{ mt: 1 }}>
          <TextField
            fullWidth
            variant="outlined"
            id="username"
            margin="normal"
            label="Login"
            name="username"
            value={state.username}
            onChange={inputChangeHandler}
            error={!!validationErrors?.username}
            helperText={validationErrors?.username}
          />

          <TextField
            fullWidth
            variant="outlined"
            id="password"
            margin="normal"
            name="password"
            label="Password"
            type="password"
            value={state.password}
            onChange={inputChangeHandler}
            error={!!validationErrors?.password}
            helperText={validationErrors?.password}
          />

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Register
          </Button>

          <Grid container>
            <Grid item>
              <Link component={RouterLink} to={'/auth/login'} variant="body2">
                {'Have an account? Login'}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}
