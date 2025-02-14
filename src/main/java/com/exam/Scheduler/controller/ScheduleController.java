package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.Exam;
import com.exam.Scheduler.entity.Schedule;
import com.exam.Scheduler.service.ExamService;
import com.exam.Scheduler.service.GraphColoringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/schedule")
public class ScheduleController {
    @Autowired
    private ExamService examService;

    @Autowired
    private GraphColoringService graphColoringService;

    @GetMapping("/exams")
    public List<Exam> getAllExams() {
        return examService.getAllExams();
    }

    @PostMapping("/generate")
    public List<Schedule> generateSchedule() {
        List<Exam> exams = examService.getAllExams();
        return graphColoringService.scheduleExams(exams);
    }
}