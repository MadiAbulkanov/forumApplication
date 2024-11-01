import { useAppSelector } from '@/app/hooks';
import UserMenu from '@/components/UI/Menu/UserMenu/UserMenu';
import { AppBar, Box, Button, Grid, styled, Toolbar, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const StyledLink = styled(Link)(() => ({
  color: 'inherit',
  textDecoration: 'none',
  padding: '5px',
  ['&:hover']: {
    color: 'inherit',
  },
}));

const AppToolbar = () => {

  const { user } = useAppSelector((state) => {
    return state.user
  });

  return (
    <>
      <AppBar position="fixed">
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center',}} >
          <Typography variant='h6' component={StyledLink} to={'/'}>
            Forum
          </Typography>
          {user ? <UserMenu/> : 
          <Grid item>
            <Button component={StyledLink} to={'/auth/login'} color="inherit">
              Login
            </Button>
            <Button component={StyledLink} to={'/auth/register'} color="inherit">
              Register
            </Button>
          </Grid>
          }
        </Toolbar>
      </AppBar>
      <Box component={Toolbar} marginBottom={2} />
    </>
  );
};

export default AppToolbar;