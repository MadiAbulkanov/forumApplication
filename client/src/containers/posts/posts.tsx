import { Link } from 'react-router-dom';
import { Typography, Grid, Button } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useEffect } from 'react';
import { fetchPosts } from '@/features/posts/posts.slice';
import { PostItem } from '@/containers/posts/postItem';

export function Posts() {
  const dispatch = useAppDispatch();

  const { posts } = useAppSelector((state) => {
    return state.posts
  });

  const { user } = useAppSelector((state) => {
    return state.user
  });

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  return (
    <Grid >
      <Grid item container direction="row" justifyContent="space-between" alignItems="center" marginBottom="20px">
        <Grid item>
          <Typography variant="h5">Posts</Typography>
        </Grid>
        {user && 
          <Grid item>
            <Button sx={{ border: '1px solid #ccc', padding: '7px 40px' }} component={Link} to={'/post/new'}>
              Add new post
            </Button>
          </Grid>
        }
      </Grid>
      <Grid >
        {posts.map((post) => (
          <Grid key={post.id}>
            <PostItem item={post} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}