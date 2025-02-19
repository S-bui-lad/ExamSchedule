package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.Student;
import com.exam.Scheduler.service.StudentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class StudentController {
    private StudentService studentService;

    public StudentController(StudentService studentService){
        this.studentService = studentService;
    }

    @PostMapping("/students/create")
    public ResponseEntity<Student> createStudent (@RequestBody Student student){
        Student sonStudent = this.studentService.handlCreateStudent(student);
        return ResponseEntity.ok(sonStudent);
    }

    @DeleteMapping("/students/delete")
    public ResponseEntity<String> deleteStudent(@PathVariable("id") long id){
        this.studentService.handlDeleteStudent(id);
        return ResponseEntity.ok("Delete Student");
    }

    @GetMapping("/students/{id}")
    public ResponseEntity<Student> getStudentById(@PathVariable("id") long id){
        Student fetchStudent = this.studentService.fetchStudentById(id);
        return ResponseEntity.ok(fetchStudent);
    }

    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudent(){
        return ResponseEntity.ok(this.studentService.fetchAllStudent());
    }

    @PutMapping("/students/update")
    public ResponseEntity<Student> updateStudent(@RequestBody Student student){
        Student sonStudent = this.studentService.handlUpdateStudent(student);
        return ResponseEntity.ok(sonStudent);
    }
}
