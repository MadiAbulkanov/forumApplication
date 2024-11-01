import { axiosApiClient } from '@/api/axiosApiClient';
import { RootState } from '@/app/store';
import { Posts } from '@/interfaces/posts.interface';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';

interface State {
  posts: Posts[];
  singlePost: Posts | null
  isLoading: boolean;
  postError: string | null;
  postValidationError: null | ValidationErrorResponse;
}

interface ErrorMessage {
  error: { message: string };
};

interface ValidationError {
  type: string;
  messages: string[];
};

type ValidationErrorResponse = ValidationError[];

type ErrorResponse = ErrorMessage | ValidationErrorResponse;

const initialState: State = {
  posts: [],
  singlePost: null,
  isLoading: false,
  postError: null,
  postValidationError: null,
};

export const fetchPosts = createAsyncThunk('fetch/posts', async () => {
  const { data } = await axiosApiClient.get('/posts');
  return data;
});

export const fetchPost = createAsyncThunk<Posts, string>('fetch/post', async (id: string) => {
  const { data } = await axiosApiClient.get<Posts>(`/posts/${id}`);
  return data;
});

export const createPost = createAsyncThunk<Posts, 
{
  payload: FormData, token: string
},
{
  rejectValue: ErrorResponse;
}
>('create/post', async ({payload, token}, { rejectWithValue }) => {
  try {
    const config = {
    headers: {
        Authorization: token
    },
   };
  const { data } = await axiosApiClient.post<Posts>('/posts', payload, config);
  return data;
  } catch (error) {
    if (isAxiosError<ErrorResponse>(error)) {
      return rejectWithValue(error.response?.data || { error: { message: 'Some error in response server' } })
    }
    throw error;
  }
});

export const deletPost = createAsyncThunk('delet/post', async (id: string) => {
  const { data } = await axiosApiClient.delete(`/posts/${id}`);
  return data;
});

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.postError = null;
        state.postValidationError = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.postError = action.error.message || 'error exception in fetchProducts ';
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.singlePost = action.payload;
        state.isLoading = false;
      })
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
        state.postError = null;
        state.postValidationError = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.posts.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload)) {
          state.postValidationError = action.payload;
          return;
        }
        state.postError = action.payload?.error.message ?? 'something wrong in post';
      })
  },
});

export default postSlice;

const selectValidationErrors = (rootState: RootState) => rootState.posts.postValidationError;

const normalizeValidationError = (validationErrors: ValidationErrorResponse | null) => {
  if (!validationErrors) return null;

  return validationErrors.reduce((acc: Record<string, string>, errorItem: ValidationError) => {
    acc[errorItem.type] = errorItem.messages.join(', ');
    return acc;
  }, {});
}

export const selectNormalizeValidationError = createSelector(
  [selectValidationErrors],
  normalizeValidationError
);