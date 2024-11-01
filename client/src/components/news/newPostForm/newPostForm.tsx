import { useState, ChangeEvent, FormEvent } from 'react';
import { Alert, Box, Button, Grid, TextField, Typography } from '@mui/material';
import FileInput from '@/components/UI/Form/FileInput';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useNavigate } from 'react-router-dom';
import { createPost, selectNormalizeValidationError } from '@/features/posts/posts.slice';
interface State {
  title: string;
  description?: string;
  image?: string;
}

const NewPostForm = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const validationErrors = useAppSelector(selectNormalizeValidationError);

  const { user } = useAppSelector((state) => {
    return state.user
  });
  const [error, setError] = useState<string | null>(null);
  const [state, setState] = useState<State>({
    title: '',
    description: '',
    image: ''
  });

  const submitFormItem = async (formData: FormData) => {
    if(user && user.token) {
      await dispatch(createPost({ payload: formData, token: user?.token })).unwrap();
    }
    navigate('/');
  };

  const submitFormHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: FormData = new FormData();
    Object.entries(state).forEach(([key, value]) => {
      if (typeof value === 'object') {
        formData.append(key, value);
      } else {
        formData.append(key, `${value}`);
      }
    });
    if (state.description || state.image) {
      submitFormItem(formData);
      setError(null);
    } else {
      setError('You must specify one of the values Description or Image');
    }
  };

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setState((prevState) => {
      return { ...prevState, [name]: value };
    });
  };

  const fileChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target?.files?.[0];
    if (file) {
      const { name } = e.target;
      setState((prevState) => ({ ...prevState, [name]: file }));
    }
  };

  return (
    <Box component={'form'} autoComplete="off" onSubmit={submitFormHandler} paddingY={2}>
      {error && <Alert severity='error'>{error}</Alert>}
      <Typography variant="h6" textAlign="center" margin="25px">
        Add new post
      </Typography>
      <Grid container direction="column" spacing={2} width="100%" display="flex">
        <Grid item xs container direction="row" justifyContent="space-evenly" alignItems="center">
          <Grid item>
            <Typography variant="h6" style={{ width: '150px' }}>
              Title
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              style={{ width: '350px' }}
              variant="outlined"
              id="title"
              label="Title"
              value={state.title}
              onChange={inputChangeHandler}
              name="title"
              error={!!validationErrors?.title}
              helperText={validationErrors?.title}
            />
          </Grid>
        </Grid>
        <Grid item xs container direction="row" justifyContent="space-evenly" alignItems="center">
          <Grid item>
            <Typography variant="h6" style={{ width: '150px' }}>
              Description
            </Typography>
          </Grid>
          <Grid item>
            <TextField
              style={{ width: '350px' }}
              multiline
              rows={3}
              variant="outlined"
              id="description"
              label="Description"
              value={state.description}
              onChange={inputChangeHandler}
              name="description"
            />
          </Grid>
        </Grid>
        <Grid item xs container direction="row" justifyContent="space-evenly" alignItems="center">
          <Grid item>
            <Typography variant="h6" style={{ width: '150px' }}>
              Image
            </Typography>
          </Grid>
          <Grid item>
            <FileInput label="Image" name="image" onChange={fileChangeHandler} />
          </Grid>
        </Grid>
        <Grid item xs container justifyContent="center">
          <Button type="submit" color="primary" variant="contained" style={{ marginTop: '35px', width: '770px' }}>
            Create post
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default NewPostForm;