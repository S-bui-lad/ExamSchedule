import React, { useState, useEffect } from 'react';
import { 
  TextField, Button, Box, Typography, Paper, Grid, Alert, 
  Snackbar, CircularProgress, IconButton, InputAdornment
} from '@mui/material';
import { IconEye, IconEyeOff } from '@tabler/icons-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PageContainer from 'src/components/container/PageContainer';
import { jwtDecode } from 'jwt-decode';

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const navigate = useNavigate();

  // Get userId from localStorage (ideally from authentication context)
  const token = localStorage.getItem('token');
  const decoded = jwtDecode(token);
  const userId = decoded.id || 1; // Fallback to 1 if not found

  // Fetch user data
  useEffect(() => {
    setLoading(true);
    console.log(decoded.id);
    axios
      .get(`http://172.20.10.2:8080/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((response) => {
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          password: '',
          confirmPassword: '',
        });
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
        setNotification({
          open: true,
          message: 'Không thể tải thông tin người dùng',
          severity: 'error'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Clear errors when field is edited
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Tên không được để trống';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email không hợp lệ';
    }
    
    // Only validate password if user is trying to change it
    if (formData.password) {
      if (formData.password.length < 6) {
        errors.password = 'Mật khẩu phải có ít nhất 6 kí tự';
      }
      
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'Mật khẩu xác nhận không khớp';
      }
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    // Prepare data for API
    const updateData = {
      name: formData.name,
      email: formData.email
    };
    
    // Only include password if it was changed
    if (formData.password) {
      updateData.password = formData.password;
    }
    
    axios
      .put(`http://172.20.10.2:8080/users/${userId}`, updateData)
      .then((response) => {
        setNotification({
          open: true,
          message: 'Cập nhật thông tin thành công',
          severity: 'success'
        });
        
        // Wait a moment before redirecting
        setTimeout(() => {
          navigate('/edit-profile');
        }, 2000);
      })
      .catch((error) => {
        console.error('Update error:', error);
        setNotification({
          open: true,
          message: `Cập nhật thất bại: ${error.response?.data?.message || error.message}`,
          severity: 'error'
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleCloseNotification = () => {
    setNotification({ ...notification, open: false });
  };

  return (
    <PageContainer title="Cập nhật thông tin cá nhân">
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
        <Paper 
          elevation={3} 
          sx={{ 
            p: 4, 
            maxWidth: 600, 
            width: '100%',
            borderRadius: 2
          }}
        >
          <Typography variant="h5" fontWeight="500" gutterBottom>
            Cập nhật thông tin cá nhân
          </Typography>
          
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {!loading && (
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    label="Họ tên"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    fullWidth
                    error={!!formErrors.name}
                    helperText={formErrors.name || ''}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    fullWidth
                    error={!!formErrors.email}
                    helperText={formErrors.email || ''}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Mật khẩu mới"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    fullWidth
                    error={!!formErrors.password}
                    helperText={formErrors.password || 'Để trống nếu không muốn thay đổi mật khẩu'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <TextField
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    fullWidth
                    error={!!formErrors.confirmPassword}
                    helperText={formErrors.confirmPassword || ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            edge="end"
                          >
                            {showConfirmPassword ? <IconEyeOff size={20} /> : <IconEye size={20} />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                
                <Grid item xs={12} sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                    <Button 
                      variant="outlined" 
                      onClick={() => navigate('/profile')}
                    >
                      Hủy bỏ
                    </Button>
                    <Button 
                      type="submit" 
                      variant="contained" 
                      disabled={loading}
                    >
                      {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </form>
          )}
        </Paper>
      </Box>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleCloseNotification} 
          severity={notification.severity}
          sx={{ width: '100%' }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </PageContainer>
  );
};

export default EditProfile;
