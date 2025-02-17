package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.Ngay;
import com.exam.Scheduler.service.ExamScheduleService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exam-schedule")
public class ExamScheduleController {

    private final ExamScheduleService examScheduleService;

    public ExamScheduleController(ExamScheduleService examScheduleService) {
        this.examScheduleService = examScheduleService;
    }

    // API lấy danh sách ngày thi
    @GetMapping("/days")
    public List<Ngay> getExamDays() {
        return examScheduleService.getExamDays();
    }

    // API hoán vị lịch thi
    @PostMapping("/swap")
    public List<Ngay> swapExamDays() {
        return examScheduleService.swapExamDays();
    }
}
