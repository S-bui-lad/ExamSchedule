package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.ExamSchedule;
import com.exam.Scheduler.entity.ExamRoom;
import jxl.Workbook;
import jxl.write.Label;
import jxl.write.WritableSheet;
import jxl.write.WritableWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.util.List;
import java.util.stream.Collectors;

public class ExcelExportService {
    public static ByteArrayInputStream exportExamSchedulesToExcel(List<ExamSchedule> schedules) {
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            WritableWorkbook workbook = Workbook.createWorkbook(out);
            WritableSheet sheet = workbook.createSheet("Exam Schedule", 0);

            // Tiêu đề cột
            String[] headers = {"Mã môn", "Tên môn", "Ngày thi", "Ca thi", "Phòng thi"};
            for (int i = 0; i < headers.length; i++) {
                sheet.addCell(new Label(i, 0, headers[i]));
            }

            // Dữ liệu
            for (int i = 0; i < schedules.size(); i++) {
                ExamSchedule schedule = schedules.get(i);
                int row = i + 1;
                sheet.addCell(new Label(0, row, schedule.getSubject().getMaMon()));
                sheet.addCell(new Label(1, row, schedule.getSubject().getTenMon()));
                sheet.addCell(new Label(2, row, "Ngày " + schedule.getExamDate()));
                sheet.addCell(new Label(3, row, "Ca " + schedule.getSlot()));
                sheet.addCell(new Label(4, row, schedule.getAssignedRooms()
                        .stream().map(ExamRoom::getTenPhong).collect(Collectors.joining(", "))));
            }

            workbook.write();
            workbook.close();
            return new ByteArrayInputStream(out.toByteArray());

        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi tạo file Excel: " + e.getMessage(), e);
        }
    }
}
