package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.Exam;
import com.exam.Scheduler.repository.ExamRepository;
import jxl.Cell;
import jxl.Sheet;
import jxl.Workbook;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.io.InputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelImportService {
    @Autowired
    private ExamRepository examRepository;

    public List<Exam> importExamsFromExcel(MultipartFile file) {
        List<Exam> exams = new ArrayList<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

        try (InputStream inputStream = file.getInputStream()) {
            Workbook workbook = Workbook.getWorkbook(inputStream);
            Sheet sheet = workbook.getSheet(0); // Lấy sheet đầu tiên

            for (int i = 1; i < sheet.getRows(); i++) { // Bỏ qua dòng tiêu đề
                Exam exam = new Exam();
                Cell subjectCell = sheet.getCell(0, i);
                Cell timeCell = sheet.getCell(1, i);
                Cell proctorCell = sheet.getCell(2, i); // Số giám thị cần thiết

                exam.setSubject(subjectCell.getContents());
                exam.setExamTime(LocalDateTime.parse(timeCell.getContents(), formatter));
                exam.setRequiredProctors(Integer.parseInt(proctorCell.getContents())); // Lấy số giám thị từ Excel

                exams.add(exam);
            }

            examRepository.saveAll(exams);
            workbook.close();
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi đọc file Excel: " + e.getMessage());
        }

        return exams;
    }
}
