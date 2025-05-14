import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, InputBase, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Typography, FormControlLabel,
  Checkbox, Pagination, MenuItem, Select, Grid,
  useTheme, useMediaQuery, Container, Stack,
  Drawer, Fab, Divider, List, ListItem, ListItemText,
  SwipeableDrawer
} from '@mui/material';
import { 
  IconTrash, 
  IconEdit, 
  IconFilter, 
  IconSearch, 
  IconMoodSmile, 
  IconMoodSad,
  IconMenu2,
  IconFilterPlus,
  IconFilterCancel
} from '@tabler/icons-react';
import PageContainer from 'src/components/container/PageContainer';
import DashboardCard from '../../components/shared/DashboardCard';

const Teacher = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const [teachers, setTeachers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ status: '', mgv: '', khoa: '' });

  const [openAddModal, setOpenAddModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const [newTeacher, setNewTeacher] = useState({ name: '', status: false, mgv: '', khoa: '' });
  const [editTeacher, setEditTeacher] = useState({ id: null, name: '', status: false, mgv: '', khoa: '' });
  const apiUrl = "http://172.20.10.2:8080/teachers";
  
  const fetchTeachers = async () => {
    try {
      const res = await fetch(apiUrl);
      const data = await res.json();
      setTeachers(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      // Use sample data for testing when API is unavailable
      const sampleData = [
        { id: 1, mgv: "GV001", name: "Nguyễn Văn A", khoa: "Công nghệ thông tin", status: true },
        { id: 2, mgv: "GV002", name: "Trần Thị B", khoa: "Kinh tế", status: false },
        { id: 3, mgv: "GV003", name: "Lê Văn C", khoa: "Công nghệ thông tin", status: true }
      ];
      setTeachers(sampleData);
      setFiltered(sampleData);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  useEffect(() => {
    let data = [...teachers];
    if (searchTerm) {
      data = data.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filters.status !== '') {
      data = data.filter(t => String(t.status) === filters.status);
    }
    if (filters.mgv) {
      data = data.filter(t => t.mgv.includes(filters.mgv));
    }
    if (filters.khoa) {
      data = data.filter(t => t.khoa.includes(filters.khoa));
    }
    setFiltered(data);
  }, [searchTerm, filters, teachers]);

  const handleAddTeacher = async () => {
    try {
      const res = await fetch(`${apiUrl}/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTeacher)
      });
      const added = await res.json();
      setTeachers(prev => [...prev, added]);
      setOpenAddModal(false);
      setNewTeacher({ name: '', status: false, mgv: '', khoa: '' });
    } catch (error) {
      console.error("Error adding teacher:", error);
      // Fallback for testing
      const newId = Math.max(...teachers.map(t => t.id)) + 1;
      const mockAdded = { ...newTeacher, id: newId };
      setTeachers(prev => [...prev, mockAdded]);
      setOpenAddModal(false);
      setNewTeacher({ name: '', status: false, mgv: '', khoa: '' });
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`${apiUrl}/delete?id=${selectedId}`, {
        method: "DELETE"
      });
      setTeachers(prev => prev.filter(t => t.id !== selectedId));
      setOpenConfirm(false);
    } catch (error) {
      console.error("Error deleting teacher:", error);
      // Fallback for testing
      setTeachers(prev => prev.filter(t => t.id !== selectedId));
      setOpenConfirm(false);
    }
  };

  const handleOpenEdit = (teacher) => {
    setEditTeacher(teacher);
    setOpenEditModal(true);
  };

  const handleUpdateTeacher = async () => {
    try {
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editTeacher)
      });
      const updated = await res.json();
      setTeachers(prev => prev.map(t => t.id === updated.id ? updated : t));
      setOpenEditModal(false);
    } catch (error) {
      console.error("Error updating teacher:", error);
      // Fallback for testing
      setTeachers(prev => prev.map(t => t.id === editTeacher.id ? editTeacher : t));
      setOpenEditModal(false);
    }
  };

  const handleClearFilters = () => {
    setFilters({ status: '', mgv: '', khoa: '' });
  };

  return (
    <PageContainer title="Quản lý giảng viên" description="Danh sách giảng viên">
      <Container disableGutters maxWidth="xl" sx={{ 
        height: '100%', 
        overflow: 'hidden',
        px: isMobile ? 0.5 : 2,
        py: isMobile ? 0.5 : 2
      }}>
        <DashboardCard title="Danh sách giảng viên" sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          p: isMobile ? 0.5 : 2,
          borderRadius: isMobile ? 1 : 2,
          boxShadow: isMobile ? 1 : 2,
          position: 'relative'
        }}>
          {/* Mobile Filter Button */}
          {isMobile && (
            <Fab 
              color="primary" 
              size="small" 
              sx={{ 
                position: 'absolute', 
                top: 16, 
                right: 16,
                zIndex: 10
              }}
              onClick={() => setFilterDrawerOpen(true)}
            >
              <IconFilterPlus size={18} />
            </Fab>
          )}

          {/* Toolbar for tablet/desktop */}
          {!isMobile && (
            <Stack spacing={2} sx={{ mb: 2 }}>
              {/* Filter Section */}
              <Stack 
                direction="row" 
                spacing={1}
                sx={{ 
                  width: '100%',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: 1
                }}
              >
                <IconButton size={isMobile ? "small" : "medium"}><IconFilter /></IconButton>
                <Select
                  value={filters.status}
                  onChange={e => setFilters({ ...filters, status: e.target.value })}
                  displayEmpty
                  size="small"
                  sx={{ minWidth: 120 }}
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="true">Hoạt động</MenuItem>
                  <MenuItem value="false">Ngưng</MenuItem>
                </Select>
                <TextField
                  label="Lọc mã GV"
                  size="small"
                  value={filters.mgv}
                  onChange={e => setFilters({ ...filters, mgv: e.target.value })}
                  sx={{ minWidth: 120 }}
                />
                <TextField
                  label="Lọc khoa"
                  size="small"
                  value={filters.khoa}
                  onChange={e => setFilters({ ...filters, khoa: e.target.value })}
                  sx={{ minWidth: 120 }}
                />
                <Button 
                  variant="outlined" 
                  size="small" 
                  startIcon={<IconFilterCancel size={18} />}
                  onClick={handleClearFilters}
                >
                  Xóa lọc
                </Button>
              </Stack>

              {/* Search and Add Button Section */}
              <Stack 
                direction="row" 
                spacing={2}
                sx={{ 
                  width: '100%',
                  justifyContent: 'space-between'
                }}
              >
                <Paper sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  width: '40%', 
                  px: 1
                }}>
                  <InputBase
                    placeholder="Tìm theo tên..."
                    fullWidth
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <IconButton><IconSearch /></IconButton>
                </Paper>
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={() => setOpenAddModal(true)}
                >
                  Thêm giảng viên
                </Button>
              </Stack>
            </Stack>
          )}

          {/* Mobile search bar */}
          {isMobile && (
            <Box sx={{ p: 1, mb: 1 }}>
              <Paper sx={{ 
                display: 'flex', 
                alignItems: 'center',
                width: '100%', 
                px: 1
              }}>
                <InputBase
                  placeholder="Tìm theo tên..."
                  fullWidth
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  sx={{ fontSize: '0.875rem' }}
                />
                <IconButton size="small"><IconSearch /></IconButton>
              </Paper>
            </Box>
          )}

          {/* Table Container with fixed height and scroll */}
          <Box sx={{ 
            flex: 1,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            overflow: 'hidden'
          }}>
            <TableContainer sx={{ 
              flex: 1,
              overflow: 'auto',
              '& .MuiTableCell-root': {
                whiteSpace: 'nowrap',
                minWidth: isMobile ? 70 : 150,
                maxWidth: isMobile ? 100 : 200,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                px: isMobile ? 0.5 : 2,
                py: isMobile ? 0.75 : 1.5,
                fontSize: isMobile ? '0.75rem' : '0.875rem'
              }
            }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell>Mã GV</TableCell>
                    <TableCell>Tên</TableCell>
                    {!isMobile && <TableCell>Khoa</TableCell>}
                    <TableCell align="center">Trạng thái</TableCell>
                    <TableCell align="center">Hành động</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filtered.map(t => (
                    <TableRow key={t.id}>
                      <TableCell>{t.mgv}</TableCell>
                      <TableCell>{t.name}</TableCell>
                      {!isMobile && <TableCell>{t.khoa}</TableCell>}
                      <TableCell align="center">
                        {t.status
                          ? <IconMoodSmile color="green" size={isMobile ? 16 : 20} />
                          : <IconMoodSad color="red" size={isMobile ? 16 : 20} />}
                      </TableCell>
                      <TableCell align="center">
                        <Stack direction="row" spacing={0.5} justifyContent="center">
                          <IconButton 
                            color="primary" 
                            onClick={() => handleOpenEdit(t)}
                            size="small"
                          >
                            <IconEdit size={isMobile ? 16 : 18} />
                          </IconButton>
                          <IconButton 
                            color="error" 
                            onClick={() => {
                              setSelectedId(t.id);
                              setOpenConfirm(true);
                            }}
                            size="small"
                          >
                            <IconTrash size={isMobile ? 16 : 18} />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Mobile Add Button and Pagination */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              p: 1,
              flexWrap: 'wrap',
              gap: 1
            }}>
              {isMobile && (
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small"
                  onClick={() => setOpenAddModal(true)}
                  sx={{ flexGrow: isMobile ? 1 : 0 }}
                >
                  Thêm giảng viên
                </Button>
              )}
              <Pagination 
                count={1} 
                size="small"
                sx={{
                  '& .MuiPaginationItem-root': {
                    fontSize: isMobile ? '0.75rem' : '0.875rem'
                  },
                  margin: isMobile ? '0 auto' : 0
                }}
              />
            </Box>
          </Box>

          {/* Mobile Filter Drawer */}
          <SwipeableDrawer
            anchor="right"
            open={filterDrawerOpen}
            onOpen={() => setFilterDrawerOpen(true)}
            onClose={() => setFilterDrawerOpen(false)}
            PaperProps={{
              sx: {
                width: '80%',
                maxWidth: 300,
                borderRadius: '8px 0 0 8px'
              }
            }}
          >
            <Box sx={{ p: 2 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                <Typography variant="h6">Bộ lọc</Typography>
                <IconButton size="small" onClick={() => setFilterDrawerOpen(false)}>
                  <IconFilterCancel size={20} />
                </IconButton>
              </Stack>
              <Divider sx={{ mb: 2 }} />
              <Stack spacing={2}>
                <Typography variant="subtitle2">Trạng thái</Typography>
                <Select
                  value={filters.status}
                  onChange={e => setFilters({ ...filters, status: e.target.value })}
                  displayEmpty
                  size="small"
                  fullWidth
                >
                  <MenuItem value="">Tất cả</MenuItem>
                  <MenuItem value="true">Hoạt động</MenuItem>
                  <MenuItem value="false">Ngưng</MenuItem>
                </Select>
                
                <Typography variant="subtitle2">Mã giảng viên</Typography>
                <TextField
                  size="small"
                  fullWidth
                  value={filters.mgv}
                  onChange={e => setFilters({ ...filters, mgv: e.target.value })}
                  placeholder="Nhập mã GV"
                />
                
                <Typography variant="subtitle2">Khoa</Typography>
                <TextField
                  size="small"
                  fullWidth
                  value={filters.khoa}
                  onChange={e => setFilters({ ...filters, khoa: e.target.value })}
                  placeholder="Nhập tên khoa"
                />
                
                <Button 
                  variant="outlined" 
                  fullWidth
                  startIcon={<IconFilterCancel size={18} />}
                  onClick={handleClearFilters}
                >
                  Xóa lọc
                </Button>
                
                <Button 
                  variant="contained" 
                  fullWidth
                  onClick={() => setFilterDrawerOpen(false)}
                >
                  Áp dụng
                </Button>
              </Stack>
            </Box>
          </SwipeableDrawer>

          {/* Dialogs */}
          <Dialog 
            open={openAddModal} 
            onClose={() => setOpenAddModal(false)}
            fullWidth
            fullScreen={isMobile}
            maxWidth={isMobile ? "xs" : "sm"}
            PaperProps={{
              sx: {
                maxHeight: '90vh',
                overflow: 'auto',
                m: isMobile ? 0 : 2,
                borderRadius: isMobile ? 0 : 2
              }
            }}
          >
            <DialogTitle sx={{ 
              p: isMobile ? 1.5 : 2,
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}>
              Thêm giảng viên
            </DialogTitle>
            <DialogContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Stack spacing={2}>
                <TextField 
                  fullWidth 
                  label="Tên" 
                  value={newTeacher.name}
                  onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })}
                  size="small"
                />
                <TextField 
                  fullWidth 
                  label="Mã GV" 
                  value={newTeacher.mgv}
                  onChange={e => setNewTeacher({ ...newTeacher, mgv: e.target.value })}
                  size="small"
                />
                <TextField 
                  fullWidth 
                  label="Khoa" 
                  value={newTeacher.khoa}
                  onChange={e => setNewTeacher({ ...newTeacher, khoa: e.target.value })}
                  size="small"
                />
                <FormControlLabel
                  control={<Checkbox checked={newTeacher.status}
                    onChange={e => setNewTeacher({ ...newTeacher, status: e.target.checked })} />}
                  label="Hoạt động"
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ 
              p: isMobile ? 1.5 : 2,
              justifyContent: isMobile ? 'space-between' : 'flex-end'
            }}>
              <Button 
                onClick={() => setOpenAddModal(false)}
                size="small"
                variant={isMobile ? "outlined" : "text"}
                fullWidth={isMobile}
              >
                Hủy
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleAddTeacher}
                size="small"
                fullWidth={isMobile}
              >
                Lưu
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog 
            open={openEditModal} 
            onClose={() => setOpenEditModal(false)}
            fullWidth
            fullScreen={isMobile}
            maxWidth={isMobile ? "xs" : "sm"}
            PaperProps={{
              sx: {
                maxHeight: '90vh',
                overflow: 'auto',
                m: isMobile ? 0 : 2,
                borderRadius: isMobile ? 0 : 2
              }
            }}
          >
            <DialogTitle sx={{ 
              p: isMobile ? 1.5 : 2,
              fontSize: isMobile ? '1.1rem' : '1.25rem'
            }}>
              Chỉnh sửa
            </DialogTitle>
            <DialogContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Stack spacing={2}>
                <TextField 
                  fullWidth 
                  label="Tên" 
                  value={editTeacher.name}
                  onChange={e => setEditTeacher({ ...editTeacher, name: e.target.value })}
                  size="small"
                />
                <TextField 
                  fullWidth 
                  label="Mã GV" 
                  value={editTeacher.mgv}
                  onChange={e => setEditTeacher({ ...editTeacher, mgv: e.target.value })}
                  size="small"
                />
                <TextField 
                  fullWidth 
                  label="Khoa" 
                  value={editTeacher.khoa}
                  onChange={e => setEditTeacher({ ...editTeacher, khoa: e.target.value })}
                  size="small"
                />
                <FormControlLabel
                  control={<Checkbox checked={editTeacher.status}
                    onChange={e => setEditTeacher({ ...editTeacher, status: e.target.checked })} />}
                  label="Hoạt động"
                />
              </Stack>
            </DialogContent>
            <DialogActions sx={{ 
              p: isMobile ? 1.5 : 2,
              justifyContent: isMobile ? 'space-between' : 'flex-end'
            }}>
              <Button 
                onClick={() => setOpenEditModal(false)}
                size="small"
                variant={isMobile ? "outlined" : "text"}
                fullWidth={isMobile}
              >
                Hủy
              </Button>
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleUpdateTeacher}
                size="small"
                fullWidth={isMobile}
              >
                Cập nhật
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog 
            open={openConfirm} 
            onClose={() => setOpenConfirm(false)}
            fullWidth
            maxWidth="xs"
            PaperProps={{
              sx: {
                m: isMobile ? 1 : 2,
                width: isMobile ? 'calc(100% - 32px)' : 'auto',
                borderRadius: 2
              }
            }}
          >
            <DialogTitle sx={{ p: isMobile ? 1.5 : 2 }}>Xác nhận xóa</DialogTitle>
            <DialogContent sx={{ p: isMobile ? 1.5 : 2 }}>
              <Typography>Bạn chắc chắn muốn xóa giảng viên này?</Typography>
            </DialogContent>
            <DialogActions sx={{ 
              p: isMobile ? 1.5 : 2,
              justifyContent: isMobile ? 'space-between' : 'flex-end'
            }}>
              <Button 
                onClick={() => setOpenConfirm(false)}
                size="small"
                variant={isMobile ? "outlined" : "text"}
                fullWidth={isMobile}
              >
                Hủy
              </Button>
              <Button 
                color="error" 
                onClick={handleDelete}
                size="small"
                variant="contained"
                fullWidth={isMobile}
              >
                Xóa
              </Button>
            </DialogActions>
          </Dialog>
        </DashboardCard>
      </Container>
    </PageContainer>
  );
};

export default Teacher;
