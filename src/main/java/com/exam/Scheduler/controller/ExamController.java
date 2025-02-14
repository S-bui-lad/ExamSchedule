package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.Exam;
import com.exam.Scheduler.service.ExcelImportService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "*") // Cho phép request từ client (nếu dùng React, Angular...)
public class ExamController {

    @Autowired
    private ExcelImportService excelImportService;

    @PostMapping("/upload")
    public ResponseEntity<?> uploadExcel(@RequestParam("file") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body("Vui lòng tải lên một file hợp lệ!");
        }

        List<Exam> exams = excelImportService.importExamsFromExcel(file);
        return ResponseEntity.ok(exams);
    }
}
