package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.Teacher;
import com.exam.Scheduler.repository.TeacherRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TeacherService {
    private final TeacherRepository teacherRepository;

    public TeacherService(TeacherRepository teacherRepository) {
        this.teacherRepository = teacherRepository;
    }

    public Teacher handleCreateTeacher(Teacher teacher){
        return this.teacherRepository.save(teacher);
    }

    public void handleDeleteTeacher(long id){
        this.teacherRepository.deleteById(id);
    }

    public Teacher fetchTeacherById(long id){
        Optional<Teacher> teacherOptional = this.teacherRepository.findById(id);
        if (teacherOptional.isPresent()){
            return teacherOptional.get();
        }
        return null;
    }

    public List<Teacher> fetchAllTeacher(){
        return this.teacherRepository.findAll();
    }

    public Teacher handleUpdateTeacher(Teacher reqTeacher){
        Teacher currentTeacher = this.fetchTeacherById(reqTeacher.getId());
        if (currentTeacher != null){
            currentTeacher.setStatus(reqTeacher.isStatus());
            currentTeacher.setName(reqTeacher.getName());
            currentTeacher.setMGV(reqTeacher.getMGV());
            currentTeacher.setKhoa(reqTeacher.getKhoa());
            currentTeacher = this.teacherRepository.save(currentTeacher);
        }
        return currentTeacher;
    }
}
