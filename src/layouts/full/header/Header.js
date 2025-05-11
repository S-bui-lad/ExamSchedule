import React from 'react';
import { Box, AppBar, Toolbar, styled, Stack, IconButton, Badge, Button, Typography } from '@mui/material';
import PropTypes from 'prop-types';

// components
import Profile from './Profile';
import { IconBellRinging, IconMenu } from '@tabler/icons-react';

const Header = (props) => {

  // const lgUp = useMediaQuery((theme) => theme.breakpoints.up('lg'));
  // const lgDown = useMediaQuery((theme) => theme.breakpoints.down('lg'));


  const AppBarStyled = styled(AppBar)(({ theme }) => ({
    boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
    background: theme.palette.background.paper,
    justifyContent: 'center',
    backdropFilter: 'blur(4px)',
    [theme.breakpoints.up('lg')]: {
      minHeight: '70px',
    },
  }));
  const ToolbarStyled = styled(Toolbar)(({ theme }) => ({
    width: '100%',
    color: theme.palette.text.secondary,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }));

  return (
    <AppBarStyled position="sticky" color="default">
      <ToolbarStyled>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="menu"
            onClick={props.toggleMobileSidebar}
            sx={{
              display: {
                lg: "none",
                xs: "inline",
              },
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <IconMenu width="20" height="20" />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 2, fontWeight: 600 }}>
            Hệ thống quản lý lịch thi
          </Typography>
        </Box>

        <Box flexGrow={1} />

        <Stack spacing={1} direction="row" alignItems="center">
          <IconButton
            size="large"
            aria-label="show notifications"
            color="inherit"
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
              },
            }}
          >
            <Badge badgeContent={4} color="error">
              <IconBellRinging width="20" height="20" />
            </Badge>
          </IconButton>
          <Profile />
        </Stack>
      </ToolbarStyled>
    </AppBarStyled>
  );
};

Header.propTypes = {
  sx: PropTypes.object,
};

export default Header;
