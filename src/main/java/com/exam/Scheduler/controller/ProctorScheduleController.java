package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.ExamSchedule;
import com.exam.Scheduler.entity.ProctorSchedule;
import com.exam.Scheduler.service.ExamScheduleService;
import com.exam.Scheduler.service.ProctorAssignmentService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/proctor")
public class ProctorScheduleController {
    private final ProctorAssignmentService proctorAssignmentService;
    private final ExamScheduleService examScheduleService;

    public ProctorScheduleController(ProctorAssignmentService proctorAssignmentService,
                                     ExamScheduleService examScheduleService) {
        this.proctorAssignmentService = proctorAssignmentService;
        this.examScheduleService = examScheduleService;
    }

    @PostMapping("/assign")
    public ResponseEntity<String> assignProctors(
            @RequestParam("file") MultipartFile file,
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate) {
        try {
            // Tạo lịch thi
            List<ExamSchedule> examSchedules = examScheduleService.scheduleExams(startDate);

            // Phân công giảng viên
            String result = proctorAssignmentService.assignProctorsFromExcel(file);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Lỗi: " + e.getMessage());
        }
    }

    @GetMapping("/schedules")
    public ResponseEntity<List<ProctorSchedule>> getAllProctorSchedules() {
        List<ProctorSchedule> schedules = proctorAssignmentService.getAllSchedules();
        return ResponseEntity.ok(schedules);
    }
}

