import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent,
  DialogTitle, IconButton, InputBase, Paper, Table,
  TableBody, TableCell, TableContainer, TableHead,
  TableRow, TextField, Typography, FormControlLabel,
  Checkbox, Pagination, MenuItem, Select, Grid,
  useTheme, useMediaQuery
} from '@mui/material';
import { 
  IconTrash, 
  IconEdit, 
  IconFilter, 
  IconSearch, 
  IconMoodSmile, 
  IconMoodSad 
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

  return (
    <PageContainer title="Quản lý giảng viên" description="Danh sách giảng viên">
      <DashboardCard title="Danh sách giảng viên">
        {/* Toolbar */}
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid item xs={12} md={6}>
            <Box display="flex" flexDirection={isMobile ? 'column' : 'row'} gap={2}>
              <Box display="flex" gap={1} alignItems="center" flexWrap="wrap">
                <IconButton size={isMobile ? "small" : "medium"}><IconFilter /></IconButton>
                <Select
                  value={filters.status}
                  onChange={e => setFilters({ ...filters, status: e.target.value })}
                  displayEmpty
                  size="small"
                  sx={{ minWidth: isMobile ? '100%' : 120 }}
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
                  sx={{ minWidth: isMobile ? '100%' : 120 }}
                />
                <TextField
                  label="Lọc khoa"
                  size="small"
                  value={filters.khoa}
                  onChange={e => setFilters({ ...filters, khoa: e.target.value })}
                  sx={{ minWidth: isMobile ? '100%' : 120 }}
                />
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ display: 'flex', alignItems: 'center', width: '100%', px: 1 }}>
              <InputBase
                placeholder="Tìm theo tên..."
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IconButton><IconSearch /></IconButton>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3} sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'flex-end' } }}>
            <Button 
              variant="contained" 
              color="primary" 
              onClick={() => setOpenAddModal(true)}
              fullWidth={isMobile}
            >
              Thêm giảng viên
            </Button>
          </Grid>
        </Grid>

        {/* Table */}
        <TableContainer sx={{ 
          maxWidth: '100%',
          overflowX: 'auto',
          '& .MuiTableCell-root': {
            whiteSpace: 'nowrap',
            minWidth: isMobile ? 100 : 150
          }
        }}>
          <Table size={isMobile ? "small" : "medium"}>
            <TableHead>
              <TableRow>
                <TableCell>Mã GV</TableCell>
                <TableCell>Tên</TableCell>
                <TableCell>Khoa</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map(t => (
                <TableRow key={t.id}>
                  <TableCell>{t.mgv}</TableCell>
                  <TableCell>{t.name}</TableCell>
                  <TableCell>{t.khoa}</TableCell>
                  <TableCell>
                    {t.status
                      ? <IconMoodSmile color="green" />
                      : <IconMoodSad color="red" />}
                  </TableCell>
                  <TableCell>
                    <Box display="flex" gap={1}>
                      <IconButton 
                        color="primary" 
                        onClick={() => handleOpenEdit(t)}
                        size={isMobile ? "small" : "medium"}
                      >
                        <IconEdit />
                      </IconButton>
                      <IconButton 
                        color="error" 
                        onClick={() => {
                          setSelectedId(t.id);
                          setOpenConfirm(true);
                        }}
                        size={isMobile ? "small" : "medium"}
                      >
                        <IconTrash />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination 
            count={1} 
            size={isMobile ? "small" : "medium"}
          />
        </Box>

        {/* Dialogs */}
        <Dialog 
          open={openAddModal} 
          onClose={() => setOpenAddModal(false)}
          fullWidth
          maxWidth={isMobile ? "xs" : "sm"}
        >
          <DialogTitle>Thêm giảng viên</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Tên" 
                  value={newTeacher.name}
                  onChange={e => setNewTeacher({ ...newTeacher, name: e.target.value })} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Mã GV" 
                  value={newTeacher.mgv}
                  onChange={e => setNewTeacher({ ...newTeacher, mgv: e.target.value })} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Khoa" 
                  value={newTeacher.khoa}
                  onChange={e => setNewTeacher({ ...newTeacher, khoa: e.target.value })} 
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox checked={newTeacher.status}
                    onChange={e => setNewTeacher({ ...newTeacher, status: e.target.checked })} />}
                  label="Hoạt động"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAddModal(false)}>Hủy</Button>
            <Button variant="contained" color="primary" onClick={handleAddTeacher}>Lưu</Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={openEditModal} 
          onClose={() => setOpenEditModal(false)}
          fullWidth
          maxWidth={isMobile ? "xs" : "sm"}
        >
          <DialogTitle>Chỉnh sửa</DialogTitle>
          <DialogContent>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Tên" 
                  value={editTeacher.name}
                  onChange={e => setEditTeacher({ ...editTeacher, name: e.target.value })} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Mã GV" 
                  value={editTeacher.mgv}
                  onChange={e => setEditTeacher({ ...editTeacher, mgv: e.target.value })} 
                />
              </Grid>
              <Grid item xs={12}>
                <TextField 
                  fullWidth 
                  label="Khoa" 
                  value={editTeacher.khoa}
                  onChange={e => setEditTeacher({ ...editTeacher, khoa: e.target.value })} 
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox checked={editTeacher.status}
                    onChange={e => setEditTeacher({ ...editTeacher, status: e.target.checked })} />}
                  label="Hoạt động"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)}>Hủy</Button>
            <Button variant="contained" color="primary" onClick={handleUpdateTeacher}>Cập nhật</Button>
          </DialogActions>
        </Dialog>

        <Dialog 
          open={openConfirm} 
          onClose={() => setOpenConfirm(false)}
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle>Xác nhận xóa</DialogTitle>
          <DialogContent>
            <Typography>Bạn chắc chắn muốn xóa giảng viên này?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenConfirm(false)}>Hủy</Button>
            <Button color="error" onClick={handleDelete}>Xóa</Button>
          </DialogActions>
        </Dialog>
      </DashboardCard>
    </PageContainer>
  );
};

export default Teacher;
