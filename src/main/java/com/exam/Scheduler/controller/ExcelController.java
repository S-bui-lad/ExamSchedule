package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.ExamRoom;
import com.exam.Scheduler.entity.Student;
import com.exam.Scheduler.entity.Subject;
import com.exam.Scheduler.service.ExcelService;
import jxl.read.biff.BiffException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ExcelController {
    private final ExcelService excelService;

    public ExcelController(ExcelService excelService) {
        this.excelService = excelService;
    }

    @PostMapping("/upload/exam-rooms")
    public ResponseEntity<?> uploadExamRoom(@RequestParam("file") MultipartFile file) {
        try {
            List<ExamRoom> examRooms = excelService.readExamRoom(file);
            return ResponseEntity.ok().body(examRooms);
        } catch (IOException | BiffException e) {
            return ResponseEntity.badRequest().body("Lỗi đọc file: " + e.getMessage());
        }
    }

    @PostMapping("/upload/subjects")
    public ResponseEntity<?> uploadSubject(@RequestParam("file") MultipartFile file) {
        try {
            List<Subject> subjects = excelService.readSubject(file);
            return ResponseEntity.ok().body(subjects);
        } catch (IOException | BiffException e) {
            return ResponseEntity.badRequest().body("Lỗi đọc file: " + e.getMessage());
        }
    }

    @PostMapping("/upload/students")
    public ResponseEntity<?> uploadStudent(@RequestParam("file") MultipartFile file){
        try{
            List<Student> students = excelService.readStudent(file);
            return ResponseEntity.ok().body(students);
        }catch (IOException | BiffException e){
            return ResponseEntity.badRequest().body("Lỗi đọc file: " + e.getMessage());
        }
    }
}
