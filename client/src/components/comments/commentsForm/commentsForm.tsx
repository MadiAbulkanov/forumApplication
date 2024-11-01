import { Grid } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { useEffect } from 'react';
import { CommentsItem } from '@/components/comments/commentsForm/commentsItem';
import { fetchCommentary } from '@/features/comments/comments.slice';

interface Props {
    postId?: string; 
}

export function CommentsForm({ postId }: Props) {
  const dispatch = useAppDispatch();

  const { comments } = useAppSelector((state) => {
    return state.comments
  });

  useEffect(() => {
    if (postId) {
      dispatch(fetchCommentary(postId)); 
    }
  }, [dispatch, postId]);

  return (
    <Grid container sx={{ width: '100%' }}>
      <Grid item container sx={{ width: '100%' }}>
        {comments.map((comment) => (
          <Grid key={comment.id} item sx={{ width: '100%' }}>
            <CommentsItem item={comment} />
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
}
