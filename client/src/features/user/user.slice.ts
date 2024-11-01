import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { axiosApiClient } from '../../api/axiosApiClient';
import { IUser } from '../../interfaces/user.interface';
import { isAxiosError } from 'axios';
import { RootState } from '../../app/store';

interface State {
  user: IUser | null; 
  author: IUser | null;
  isLoading: boolean;
  signUpError: string | null;
  signUpValidationError: null | ValidationErrorResponse;
  signInError: string | null;
  signInValidationError: null | ValidationErrorResponse;
}

interface UserRequestData {
    username: string;
    password: string; 
}

interface ErrorMessage {
    error: { message: string };
};

interface ValidationError {
    type: string;
    messages: string[];
};

type ValidationErrorResponse = ValidationError[];

type ErrorResponse = ValidationErrorResponse | ErrorMessage

const initialState: State = {
  user: null,
  author: null,
  isLoading: false,
  signUpError: null,
  signUpValidationError: null,
  signInError: null,
  signInValidationError: null,
};

export const fetchUser = createAsyncThunk<IUser, number>('fetch/user', async (id: number) => {
    const { data } = await axiosApiClient.get<IUser>(`/users/${id}`);
    return data;
});

export const signUp = createAsyncThunk<
IUser, 
UserRequestData,
{
    rejectValue: ErrorResponse;
}
>('user/signUp', async (payload: UserRequestData, { rejectWithValue }) => {
    try {
       const { data } = await axiosApiClient.post<IUser>('/users', payload);
        return data; 
    } catch (error) {
        if (isAxiosError<ErrorResponse>(error)) {
            return rejectWithValue(error.response?.data || { error: { message: 'Some error in response server' } })
        }
        throw error;
    }
});

export const signIn = createAsyncThunk<
IUser, 
UserRequestData,
{
    rejectValue: ErrorResponse;
}

>('user/signIn', async (payload: UserRequestData, { rejectWithValue }) => {
    try {
       const { data } = await axiosApiClient.post<IUser>('/users/sessions', payload);
       return data; 
    } catch (error) {
        if (isAxiosError<ErrorResponse>(error)) {
            return rejectWithValue(error.response?.data || { error: { message: 'Some error in response server' } })
        }
        throw error;
    }
});


const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
        state.user = null;
    }
  },
  extraReducers: (build) => {
    build
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.signUpError = null;
        state.signUpValidationError = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload)) {
            state.signUpValidationError = action.payload;
            return;
          }
          state.signUpError = action.payload?.error.message ?? 'something wrong in signUp';
      })
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.signInError = null;
        state.signInValidationError = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        if (Array.isArray(action.payload)) {
            state.signInValidationError = action.payload;
            return;
          }
          state.signInError = action.payload?.error.message ?? 'something wrong in signIn';
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.signUpError = null;
        state.signUpValidationError = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.author = action.payload;
        state.isLoading = false;
      })
  },
});

export const { logout } = userSlice.actions;
export default userSlice;

const selectSignUpValidationErrors = (rootState: RootState) => rootState.user.signUpValidationError;
const selectSignInValidationErrors = (rootState: RootState) => rootState.user.signInValidationError;

const normalizeValidationError = (validationErrors: ValidationErrorResponse | null) => {
  if (!validationErrors) return null;

  return validationErrors.reduce((acc: Record<string, string>, errorItem: ValidationError) => {
    acc[errorItem.type] = errorItem.messages.join(', ');
    return acc;
  }, {});
}

export const selectSignUpNormalizeValidationError = createSelector(
  [selectSignUpValidationErrors],
  normalizeValidationError
);

export const selectSignInNormalizeValidationError = createSelector(
  [selectSignInValidationErrors],
  normalizeValidationError
);