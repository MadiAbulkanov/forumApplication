import { axiosApiClient } from '@/api/axiosApiClient';
import { RootState } from '@/app/store';
import { Comments } from '@/interfaces/comments.interface';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { isAxiosError } from 'axios';
interface State {
  comments: Comments[];
  isLoading: boolean;
  comentsError: string | null;
  comentsValidationError: null | ValidationErrorResponse;
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
  comments: [],
  isLoading: false,
  comentsError: null,
  comentsValidationError: null,
};

export const fetchComments = createAsyncThunk('fetch/comments', async () => {
  const { data } = await axiosApiClient.get('/comments');
  return data;
});

export const fetchCommentary = createAsyncThunk('fetch/commentary', async (postId: string) => {
    const { data } = await axiosApiClient.get(`/comments?post_id=${postId}`);
    return data;
  });

export const createCommentary = createAsyncThunk<Comments,
{
  payload: FormData, token: string
},
{
  rejectValue: ErrorResponse;
}
>('post/commentary', async ({payload, token}, { rejectWithValue }) => {
  try {
    const config = {
    headers: {
        Authorization: token
    },
   };
  const { data } = await axiosApiClient.post<Comments>('/comments', payload, config);
  return data;
  } catch (error) {
    if (isAxiosError<ErrorResponse>(error)) {
      return rejectWithValue(error.response?.data || { error: { message: 'Some error in response server' } })
    }
    throw error;
  }
});

export const deletCommentary = createAsyncThunk('delet/commentary', async (id: string) => {
  const { data } = await axiosApiClient.delete(`/comments/${id}`);
  return data;
});

const commentSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (build) => {
    build
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true;
        state.comentsError = null;
        state.comentsValidationError = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.isLoading = false;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false;
        state.comentsError = action.error.message || 'error exception in fetchProducts ';
      })
      .addCase(fetchCommentary.fulfilled, (state, action) => {
        state.comments = action.payload;
        state.isLoading = false;
      })
      .addCase(createCommentary.pending, (state) => {
        state.isLoading = true;
        state.comentsError = null;
        state.comentsValidationError = null;
      })
      .addCase(createCommentary.fulfilled, (state, action) => {
        state.comments.push(action.payload);
        state.isLoading = false;
      })
      .addCase(createCommentary.rejected, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload)) {
          state.comentsValidationError = action.payload;
          return;
        }
        state.comentsError = action.payload?.error.message ?? 'something wrong in post';
      })
  },
});

export default commentSlice;

const selectValidationErrors = (rootState: RootState) => rootState.comments.comentsValidationError;

const normalizeValidationError = (validationErrors: ValidationErrorResponse | null) => {
  if (!validationErrors) return null;

  return validationErrors.reduce((acc: Record<string, string>, errorItem: ValidationError) => {
    acc[errorItem.type] = errorItem.messages.join(', ');
    return acc;
  }, {});
}

export const selectCreateNormalizeValidationError = createSelector(
  [selectValidationErrors],
  normalizeValidationError
);