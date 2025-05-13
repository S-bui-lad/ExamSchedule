package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.ExamSchedule;
import com.exam.Scheduler.entity.Subject;
import com.exam.Scheduler.service.ExamScheduleService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class ExamScheduleController {
    private ExamScheduleService examScheduleService;

    public ExamScheduleController(ExamScheduleService examScheduleService) {
        this.examScheduleService = examScheduleService;
    }

    @PostMapping("/generate")
    public List<ExamSchedule> generateExamSchedule(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        return examScheduleService.scheduleExams(startDate);
    }

    @GetMapping("/history")
    public ResponseEntity<List<ExamSchedule>> getExamScheduleHistory() {
        List<ExamSchedule> schedules = examScheduleService.getAllExamSchedules();
        return ResponseEntity.ok(schedules);
    }
}
