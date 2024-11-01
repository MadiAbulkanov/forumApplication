import {
    Grid,
    Card,
    Button,
    Typography,
  } from '@mui/material';
  import { useAppDispatch, useAppSelector } from '@/app/hooks';
  import { Comments } from '@/interfaces/comments.interface';
  import { deletCommentary, fetchCommentary } from '@/features/comments/comments.slice';
  import { useEffect, useState } from 'react';
  import { IUser } from '@/interfaces/user.interface';
  import { fetchUser } from '@/features/user/user.slice';
  
  interface Props {
      item: Comments;
    }
  
  export function CommentsItem({ item }: Props) {
    const dispatch = useAppDispatch();
    const { id, postId, datatime, comments, userId } = item;
  
    const { user } = useAppSelector((state) => {
      return state.user
    });
  
    const [author, setAuthor] = useState<IUser | null>(null);
  
    useEffect(() => {
      const loadAuthor = async () => {
        const user = await dispatch(fetchUser(userId)).unwrap();
        setAuthor(user);
      }
      loadAuthor();
    }, [dispatch, userId]);
  
    const commentDelet = async (id: string) => {
      await dispatch(deletCommentary(id));
      dispatch(fetchCommentary(postId));
    }
  
    const dateFormatting = new Date(datatime).toLocaleDateString();
    const timeFormatting = new Date(datatime).toLocaleTimeString();
  
    return (
      <Grid item sx={{ border: '1px solid #ccc', padding: '10px', height: '100%', width: '100%' }}>
        <Card  sx={{ height: '100%', width: '100%' }}>
          <Grid container direction="column" justifyContent="space-between" sx={{ height: '100%', padding: "15px" }}>
          <Grid item >
            <Grid item sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="h6" textAlign="center" margin="15px">Author: {author?.username}</Typography>
              <Typography variant="h6" textAlign="center" margin="15px">{dateFormatting} {timeFormatting}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6" margin="15px">{comments}</Typography>
            </Grid>
            {user && user.id === userId &&
              <Grid item>
                <Button sx={{ padding: "5px 25px", border: "1px solid", float: "right" }}  onClick={() => commentDelet(id.toString())}>
                  Delete
                </Button>
              </Grid>
            }
          </Grid>
          </Grid>
        </Card>
      </Grid>
    );
  }
  