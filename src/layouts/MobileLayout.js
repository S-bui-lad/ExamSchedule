// MobileLayout.js
import React, { useState } from 'react';
import { 
  AppBar, Box, Drawer, IconButton, Toolbar, Typography, 
  List, ListItem, ListItemIcon, ListItemText, Divider 
} from '@mui/material';
import { IconMenu2 } from '@tabler/icons-react';
import { Outlet, useNavigate } from 'react-router-dom';
import Menuitems from './full/sidebar/MenuItems';

const MobileLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  
  const handleNavigation = (href) => {
    navigate(href);
    setMobileOpen(false);
  };
  
  const drawer = (
    <Box>
      <Box sx={{ p: 2, textAlign: 'center' }}>
        <Typography variant="h6">Hệ thống Quản lý Lịch thi</Typography>
      </Box>
      <Divider />
      <List>
        {Menuitems.map((item) => (
          <ListItem 
            button 
            key={item.id} 
            onClick={() => handleNavigation(item.href)}
            sx={{
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'primary.main'
              }
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <item.icon stroke={1.5} size="20" />
            </ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <IconMenu2 />
          </IconButton>
          <Typography variant="h6" noWrap>
            Lịch thi
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'block', md: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: 280 
          },
        }}
      >
        {drawer}
      </Drawer>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 2, 
          width: '100%',
          mt: 8 // To account for AppBar height
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default MobileLayout;