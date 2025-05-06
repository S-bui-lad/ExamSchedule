package com.exam.Scheduler.controller;

import com.exam.Scheduler.entity.ExamSchedule;
import com.exam.Scheduler.service.ExamScheduleService;
import com.exam.Scheduler.service.ExcelExportService;
import org.springframework.core.io.InputStreamResource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/examschedules")
public class ExcelExportController {
    private final ExamScheduleService examScheduleService;

    public ExcelExportController(ExamScheduleService examScheduleService) {
        this.examScheduleService = examScheduleService;
    }

    @GetMapping("/export")
    public ResponseEntity<InputStreamResource> exportExamSchedulesToExcel(
            @RequestParam("start") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate
    ) throws IOException {
        List<ExamSchedule> schedules = examScheduleService.scheduleExams(startDate);
        ByteArrayInputStream in = ExcelExportService.exportExamSchedulesToExcel(schedules);

        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Disposition", "attachment; filename=exam_schedule.xlsx");

        return ResponseEntity.ok()
                .headers(headers)
                .contentType(MediaType.parseMediaType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"))
                .body(new InputStreamResource(in));
    }

}
