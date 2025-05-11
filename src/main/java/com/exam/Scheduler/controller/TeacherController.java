package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.Teacher;
import com.exam.Scheduler.service.TeacherService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TeacherController {
    private TeacherService teacherService;

    public TeacherController(TeacherService teacherService){
        this.teacherService = teacherService;
    }

    @PostMapping("/teachers/create")
    public ResponseEntity<Teacher> createTeacher(@RequestBody Teacher teacher){
        Teacher sonTeacher = this.teacherService.handleCreateTeacher(teacher);
        return ResponseEntity.status(HttpStatus.CREATED).body(sonTeacher);
    }

    @DeleteMapping("/teachers/delete")
    public ResponseEntity<String> deleteTeacher(@PathVariable("id") long id){
        this.teacherService.handleDeleteTeacher(id);
        return ResponseEntity.status(HttpStatus.OK).body("Delete Teacher");
    }

    @GetMapping("/teachers/{id}")
    public ResponseEntity<Teacher> getTeacherById(@PathVariable("id") long id){
        Teacher fetchTeacher = this.teacherService.fetchTeacherById(id);
        return ResponseEntity.status(HttpStatus.OK).body(fetchTeacher);
    }

    @GetMapping("/teachers")
    public ResponseEntity<List<Teacher>> getAllTeacher(){
        return ResponseEntity.status(HttpStatus.OK).body(this.teacherService.fetchAllTeacher());
    }

    @PutMapping("/teachers")
    public ResponseEntity<Teacher> updateTeacher(@RequestBody Teacher teacher){
        Teacher sonTeacher = this.teacherService.handleUpdateTeacher(teacher);
        return ResponseEntity.status(HttpStatus.OK).body(sonTeacher);
    }
    @GetMapping("/teachers/filter")
    public ResponseEntity<List<Teacher>> filterTeachers(
            @RequestParam(required = false) Boolean status,
            @RequestParam(required = false) String mgv,
            @RequestParam(required = false) String khoa
    ) {
        List<Teacher> filtered = teacherService.filterTeachers(status, mgv, khoa);
        return ResponseEntity.ok(filtered);
    }

    @GetMapping("/teachers/search")
    public ResponseEntity<List<Teacher>> searchTeachers(@RequestParam String name) {
        List<Teacher> found = teacherService.searchTeachersByName(name);
        return ResponseEntity.ok(found);
    }
}
