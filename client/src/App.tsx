import { FullPost } from '@/components/news/fullPost/fullPost';
import NewPostForm from '@/components/news/newPostForm/newPostForm';
import AppToolbar from '@/components/UI/AppToolbar/AppToolbar';
import { Login } from '@/containers/login/login';
import { Posts } from '@/containers/posts/posts';
import { Register } from '@/containers/register/register';
import { Container, CssBaseline } from '@mui/material';
import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <>
      <CssBaseline />
      <header>
        <AppToolbar />
      </header>
      <main>
        <Container maxWidth="xl">
          <Routes>
            <Route path="/" element={<Posts />} />
            <Route path="/post/new" element={<NewPostForm />} />
            <Route path="/post/:id" element={<FullPost />} />
            <Route path="auth/register" element={<Register />} />
            <Route path="auth/login" element={<Login />} />
          </Routes>
        </Container>
      </main>
    </>
  );
}

export default App;