package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.ExamSchedule;
import com.exam.Scheduler.service.ProctorAssignmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/proctor-schedule")
public class ProctorScheduleController {


    private ProctorAssignmentService proctorAssignmentService;

    public ProctorScheduleController(ProctorAssignmentService proctorAssignmentService) {
        this.proctorAssignmentService = proctorAssignmentService;
    }

    @PostMapping("/generate")
    public ResponseEntity<String> generateProctorSchedule(@RequestBody List<ExamSchedule> examSchedules) {
        String result = proctorAssignmentService.assignProctorsToExams(examSchedules);

        if (result.startsWith("Không đủ")) {
            return ResponseEntity.badRequest().body(result);
        }

        return ResponseEntity.ok(result);
    }
}

