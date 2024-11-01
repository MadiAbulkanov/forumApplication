import commentSlice from '@/features/comments/comments.slice';
import postSlice from '@/features/posts/posts.slice';
import userSlice from '@/features/user/user.slice';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: { 
    [postSlice.name]: postSlice.reducer,
    [commentSlice.name]: commentSlice.reducer,
    [userSlice.name]: userSlice.reducer,
   },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
