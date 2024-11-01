import { Link } from 'react-router-dom';
import {
  Grid,
  Card,
  CardMedia,
  Button,
  Typography,
} from '@mui/material';
import { apiURL } from '@/constants';
import { useAppDispatch, useAppSelector } from '@/app/hooks';
import { Posts } from '@/interfaces/posts.interface';
import { deletPost, fetchPosts } from '@/features/posts/posts.slice';
import imageNotAvalable from "@/assets/No_Image_Available.jpg";
import { fetchUser } from '@/features/user/user.slice';
import { useEffect, useState } from 'react';
import { IUser } from '@/interfaces/user.interface';

interface Props {
  item: Posts;
}

export function PostItem({ item }: Props) {
  const dispatch = useAppDispatch();
  const { id, title, image, datatime, userId } = item;
  const [author, setAuthor] = useState<IUser | null>(null);
  
  const { user } = useAppSelector((state) => {
    return state.user
  });

  useEffect(() => {
    const loadAuthor = async () => {
      const user = await dispatch(fetchUser(userId)).unwrap();
      setAuthor(user);
    }
    loadAuthor();
  }, [dispatch, userId]);
 
  const cardImage = image ? `${apiURL}/uploads/${image}` : imageNotAvalable;

  const dateFormatting = new Date(datatime).toLocaleDateString();
  const timeFormatting = new Date(datatime).toLocaleTimeString();

  const postDelet = async (id: string) => {
    await dispatch(deletPost(id));
    dispatch(fetchPosts());
  }

  return (
    <Grid item sx={{ padding: '10px', height: '100%', width: '100%' }}>
      <Card sx={{ padding: '10px', width: '100%', display: 'flex', border: "1px solid #ccc" }} >
          <Grid item sx={{ width: '20%', margin: '5px', padding: '5px' }}>
            <CardMedia
          component="img"
          height={'100%'}
          width={'100%'}
          image={cardImage}
          sx={{ objectFit: 'cover', objectPosition: 'center' }}
          alt={title}
        />
        </Grid>
        <Grid item sx={{ padding: '1px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'flex-start'  }} >
          <Grid item>
            <Typography variant="h6" textAlign="center" margin="15px">{dateFormatting} {timeFormatting} by {author?.username}</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6" textAlign="center" margin="15px">{title}</Typography>
          </Grid>
          <Grid item>
            {user && user.id === userId &&
            <Button sx={{ padding: "5px 25px", border: "1px solid #7c0000", color: "#7c0000", float: "right" }}  onClick={() => postDelet(id.toString())}>
              Delete
            </Button>
            }
            <Button sx={{ padding: "5px 25px", marginRight: "10px", border: "1px solid", float: "right" }}  component={Link} to={`/post/${id}`} >
              Read Full Post
            </Button>
          </Grid>
        </Grid>
      </Card>
    </Grid>
  );
}
