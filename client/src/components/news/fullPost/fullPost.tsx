import { useParams } from 'react-router-dom';
import { Typography, Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useEffect } from 'react';
import { CommentsForm } from '@/components/comments/commentsForm/commentsForm';
import AddComments from '@/components/comments/addComments/addComments';
import { fetchPost } from '@/features/posts/posts.slice';

export function FullPost() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const { singlePost } = useAppSelector((state) => {
    return state.posts;
  });

  const { user } = useAppSelector((state) => {
    return state.user
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchPost(id));
    }
  }, [dispatch, id]);

  const dateFormatting = singlePost?.datatime && new Date(singlePost.datatime).toLocaleDateString();
  const timeFormatting = singlePost?.datatime && new Date(singlePost.datatime).toLocaleTimeString();

  return (
    <Grid container direction="column" spacing={2}>
      <Grid item sx={{ border: '1px solid #ccc', padding: '20px', height: '100%', width: '100%', marginBottom: '20px' }}>
        <Typography variant="h6" textAlign="right" margin="15px">
          {dateFormatting} {timeFormatting}
        </Typography>
        <Typography variant="h6" textAlign="center" margin="15px">
          {singlePost?.title}
        </Typography>
        <Typography variant="h6" textAlign="center" margin="15px">
          {singlePost?.description}
        </Typography>
      </Grid>
      <Grid sx={{ border: '1px solid #ccc', padding: '10px', height: '100%', width: '100%' }}>
        <Typography variant="h6" margin="35px">
          Comments
        </Typography>
        <CommentsForm postId={singlePost?.id}/>
        {user && 
          <Grid item>
            <Typography variant="h6" textAlign="center" margin="15px">
              Add comment: 
            </Typography>
            <Grid container direction="row" justifyContent="space-around">
              <Grid item>
                <AddComments postId={singlePost?.id}/>
              </Grid>
            </Grid>
          </Grid>
        }
      </Grid>
    </Grid>
  );
}