package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.Student;
import com.exam.Scheduler.entity.Subject;
import com.exam.Scheduler.repository.StudentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StudentService {
    private StudentRepository studentRepository;

    public StudentService(StudentRepository studentRepository){
        this.studentRepository = studentRepository;
    }

    public Student handlCreateStudent(Student student){
        return this.studentRepository.save(student);
    }

    public void handlDeleteStudent(long id){
        this.studentRepository.deleteById(id);
    }

    public void deleteAllStudents() {
        studentRepository.deleteAll();
    }

    public Student fetchStudentById(long id){
        Optional<Student> studentOptional = this.studentRepository.findById(id);
        if(studentOptional.isPresent()){
            return studentOptional.get();
        }
        return  null;
    }

      public List<Student> fetchAllStudent(){
        return this.studentRepository.findAll();
    }

    public Student handlUpdateStudent(Student reqStudent){
        Student currentStudent =  this.fetchStudentById(reqStudent.getId());
        if(currentStudent != null){
            currentStudent.setLop(reqStudent.getLop());
            currentStudent.setEmail(reqStudent.getEmail());
            currentStudent.setMssv(reqStudent.getMssv());
            currentStudent.setName(reqStudent.getName());
            currentStudent.setEmail(reqStudent.getEmail());
        }

        return currentStudent;
    }
}
