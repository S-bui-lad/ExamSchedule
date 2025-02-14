package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.Exam;
import com.exam.Scheduler.repository.ExamRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelImportService {
    @Autowired
    private ExamRepository examRepository;

    public List<Exam> importExamsFromExcel(MultipartFile file) {
        List<Exam> exams = new ArrayList<>();

        try (InputStream inputStream = file.getInputStream();
             Workbook workbook = new XSSFWorkbook(inputStream)) {

            Sheet sheet = workbook.getSheetAt(0);
            for (Row row : sheet) {
                if (row.getRowNum() == 0) continue; // Bỏ qua dòng tiêu đề

                Exam exam = new Exam();
                exam.setSubject(row.getCell(0).getStringCellValue());
                exam.setExamTime(row.getCell(1).getStringCellValue());

                exams.add(exam);
            }
            examRepository.saveAll(exams);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi đọc file Excel: " + e.getMessage());
        }

        return exams;
    }
}
