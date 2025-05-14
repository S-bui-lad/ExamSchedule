import { useMediaQuery, Box, Drawer, styled } from '@mui/material';
import SidebarItems from './SidebarItems';

import { Sidebar, Logo } from 'react-mui-sidebar';
/*logo Hau có thể viết qua svg*/
import logo from '../../../assets/images/logos/Logo_HAU.png'

const MSidebar = (props) => {

  const lgUp = useMediaQuery((theme) => theme.breakpoints.up("lg"));
  const sidebarWidth = '270px';

  // Custom CSS for short scrollbar
  const scrollbarStyles = {
    '&::-webkit-scrollbar': {
      width: '7px',

    },
    '&::-webkit-scrollbar-thumb': {
      backgroundColor: '#eff2f7',
      borderRadius: '15px',
    },
  };

  const StyledDrawer = styled(Drawer)(({ theme }) => ({
    '& .MuiDrawer-paper': {
      boxShadow: '0px 2px 4px rgba(0,0,0,0.1)',
      ...scrollbarStyles,
    },
  }));

  if (lgUp) {
    return (
      <Box
        sx={{
          width: sidebarWidth,
          flexShrink: 0,
        }}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar for desktop */}
        {/* ------------------------------------------- */}
        <StyledDrawer
          anchor="left"
          open={props.isSidebarOpen}
          variant="permanent"
          PaperProps={{
            sx: {
              boxSizing: 'border-box',
            },
          }}
        >
          {/* ------------------------------------------- */}
          {/* Sidebar Box */}
          {/* ------------------------------------------- */}
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
            }}
          >

            <Sidebar
              width={'270px'}
              collapsewidth="80px"
              open={props.isSidebarOpen}
              themeColor="#3f51b5"
              themeSecondaryColor="#f50057"
              showProfile={false}
            >
              {/* ------------------------------------------- */}
              {/* Logo */}
              {/* ------------------------------------------- */}
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                width: '100%', 
                padding: '16px 0'
              }}>
                <Logo img={logo} />
              </Box>
              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                {/* ------------------------------------------- */}
                {/* Sidebar Items */}
                {/* ------------------------------------------- */}
                <SidebarItems />
              </Box>
            </Sidebar >
          </Box>
        </StyledDrawer >
      </Box >
    );
  }
  return (
    <StyledDrawer
      anchor="left"
      open={props.isMobileSidebarOpen}
      onClose={props.onSidebarClose}
      variant="temporary"
      PaperProps={{
        sx: {
          boxShadow: (theme) => theme.shadows[8],
        },
      }}
    >
      <Sidebar
        width={'270px'}
        collapsewidth="80px"
        isCollapse={false}
        mode="light"
        direction="ltr"
        themeColor="#3f51b5"
        themeSecondaryColor="#f50057"
        showProfile={false}
      >
        {/* ------------------------------------------- */}
        {/* Sidebar For Mobile */}
        {/* ------------------------------------------- */}
        <SidebarItems />
        
      </Sidebar>
    </StyledDrawer>
  );
};
export default MSidebar;
