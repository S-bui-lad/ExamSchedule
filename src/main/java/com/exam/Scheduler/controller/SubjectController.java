package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.Subject;
import com.exam.Scheduler.service.SubjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class SubjectController {
    private SubjectService subjectService;
    public SubjectController(SubjectService subjectService){
        this.subjectService =subjectService;
    }

    @PostMapping("/subjects/create")
    public ResponseEntity<Subject> createSubject (@RequestBody Subject subject){
        Subject sonSubject = this.subjectService.handleCreateSubject(subject);
        return ResponseEntity.status(HttpStatus.CREATED).body(sonSubject);
    }

    @DeleteMapping("/subjects/delete/{id}")
    public ResponseEntity<String> deleteSubject(@PathVariable("id") long id){
        this.subjectService.handleDeleteSubject(id);
        return ResponseEntity.status(HttpStatus.OK).body("Delete Subject");
    }

    @GetMapping("/subjects/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable("id") long id){
        Subject fetchSubject = this.subjectService.fetchSubjectById(id);
        return ResponseEntity.status(HttpStatus.OK).body(fetchSubject);
    }

    @GetMapping("/subjects")
    public ResponseEntity<List<Subject>> getAllSubject(){
        return ResponseEntity.status(HttpStatus.OK).body(this.subjectService.fetchAllSubject());
    }

    @PutMapping("/subjects")
    public ResponseEntity<Subject> updateSubject(@RequestBody Subject subject){
        Subject sonSubject = this.subjectService.handleUpdateSubject(subject);
        return ResponseEntity.status(HttpStatus.OK).body(sonSubject);
    }
}
