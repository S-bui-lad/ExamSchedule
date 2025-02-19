package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.ExamSchedule;
import com.exam.Scheduler.entity.Subject;
import com.exam.Scheduler.service.ExamScheduleService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
public class ExamScheduleController {
    private ExamScheduleService examScheduleService;

    public ExamScheduleController(ExamScheduleService examScheduleService) {
        this.examScheduleService = examScheduleService;
    }

    @PostMapping("/generate")
    public List<ExamSchedule> generateExamSchedule() {
        return examScheduleService.scheduleExams();
    }
}
