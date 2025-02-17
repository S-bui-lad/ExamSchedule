package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.ExamRoom;
import com.exam.Scheduler.service.ExamRoomService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class ExamRoomController {
    private ExamRoomService examRoomService;

    public ExamRoomController(ExamRoomService examRoomService){
        this.examRoomService = examRoomService;
    }

    @PostMapping("/examrooms/create")
    public ResponseEntity<ExamRoom> createExamRoom(@RequestBody ExamRoom examRoom){
        ExamRoom sonExamRoom = this.examRoomService.handleCreateExamRoom(examRoom);
        return ResponseEntity.status(HttpStatus.CREATED).body(sonExamRoom);
    }

    @DeleteMapping("/examrooms/delete/{id}")
    public ResponseEntity<String> deleteExamRoom(@PathVariable("id") long id){
        this.examRoomService.handleDeleteExamRoom(id);
        return ResponseEntity.status(HttpStatus.OK).body("Delete Exam Room");
    }

    @GetMapping("/examrooms/{id}")
    public ResponseEntity<ExamRoom> getExamRoomById(@PathVariable("id") long id){
        ExamRoom fetchExamRoom = this.examRoomService.fetchExamRoomById(id);
        return ResponseEntity.status(HttpStatus.OK).body(fetchExamRoom);
    }

    @GetMapping("/examrooms")
    public ResponseEntity<List<ExamRoom>> getAllExamRoom(){
        return ResponseEntity.status(HttpStatus.OK).body(this.examRoomService.fetchAllExamRoom());
    }

    @PutMapping("/examrooms")
    public ResponseEntity<ExamRoom> updateExamRoom(@RequestBody ExamRoom examRoom){
        ExamRoom sonExamRoom = this.examRoomService.handleUpdateExamRoom(examRoom);
        return ResponseEntity.status(HttpStatus.OK).body(sonExamRoom);
    }

}
