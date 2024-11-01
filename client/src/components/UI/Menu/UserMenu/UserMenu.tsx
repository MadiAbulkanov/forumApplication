import { useAppDispatch } from '@/app/hooks';
import { logout } from '@/features/user/user.slice';
import Button from '@mui/material/Button';

export default function UserMenu() {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(logout());
  };

  return (
    <div>
      <Button
        id="user-menu-button"
        aria-haspopup="true"
        onClick={handleClick}
        color='inherit'
      >
        Logout
      </Button>
    </div>
  );
}