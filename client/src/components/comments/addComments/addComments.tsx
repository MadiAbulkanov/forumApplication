import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Box, Button, Grid, TextField } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { createCommentary, fetchCommentary, selectCreateNormalizeValidationError } from '@/features/comments/comments.slice';
interface State {
  comments: string;
  postId: string;
}
interface Props {
  postId?: string;
}

const AddComments = ({ postId }: Props) => {
  const dispatch = useAppDispatch();
  const validationErrors = useAppSelector(selectCreateNormalizeValidationError);
  const { user } = useAppSelector((state) => {
    return state.user
  });

  const [state, setState] = useState<State>({
    comments: '',
    postId: '',
  });

  useEffect(() => {
    if (postId) {
      setState((prevState) => ({
        ...prevState,
        postId: postId,
      }));
    }
  }, [postId]);

  const submitFormItem = async (formData: FormData) => {
    if(postId && user && user.token) {
     await dispatch(createCommentary({ payload: formData, token: user?.token })).unwrap();
     dispatch(fetchCommentary(postId));

     setState({
       comments: '',
       postId: '',
     }); 
    }
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
    submitFormItem(formData);
  };

  const inputChangeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <Box component={'form'} autoComplete="off" onSubmit={submitFormHandler} paddingY={2}>
        <Grid item >
            <TextField
              sx={{ width: "500px" }}
              multiline
              variant="outlined"
              id="comments"
              label="Comments"
              value={state.comments}
              onChange={inputChangeHandler}
              name="comments"
              error={!!validationErrors?.comments}
              helperText={validationErrors?.comments}
            />
          <Button type="submit" color="primary" variant="contained" sx={{ width: "100px", height: "55px", marginLeft: "10px" }}>
            Add
          </Button>
        </Grid>
    </Box>
  );
};

export default AddComments;