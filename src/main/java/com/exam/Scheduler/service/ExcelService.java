package com.exam.Scheduler.service;

import com.exam.Scheduler.entity.ExamRoom;
import com.exam.Scheduler.entity.Subject;
import jxl.Workbook;
import jxl.Sheet;
import jxl.read.biff.BiffException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

@Service
public class ExcelService {
    private final ExamRoomService examRoomService;
    private final SubjectService subjectService;

    public ExcelService(ExamRoomService examRoomService, SubjectService subjectService) {
        this.examRoomService = examRoomService;
        this.subjectService = subjectService;
    }

    // Đọc danh sách phòng thi từ file Excel
    public List<ExamRoom> readExamRoom(MultipartFile file) throws IOException, BiffException {
        List<ExamRoom> examRooms = new ArrayList<>();
        InputStream inputStream = file.getInputStream();
        Workbook workbook = Workbook.getWorkbook(inputStream);
        Sheet sheet = workbook.getSheet(0); // Lấy sheet đầu tiên

        for (int i = 1; i < sheet.getRows(); i++) { // Bỏ qua tiêu đề
            ExamRoom newExamRoom = new ExamRoom();
            newExamRoom.setMP(getCellValue(sheet, i, 0));
            newExamRoom.setQuantity(parseInteger(getCellValue(sheet, i, 1)));
            newExamRoom.setTeacher(getCellValue(sheet, i, 2));
            newExamRoom.setNote(getCellValue(sheet, i, 3));

            examRooms.add(examRoomService.handleCreateExamRoom(newExamRoom));
        }
        workbook.close();
        return examRooms;
    }

    // Đọc danh sách môn học từ file Excel
    public List<Subject> readSubject(MultipartFile file) throws IOException, BiffException {
        List<Subject> subjects = new ArrayList<>();
        InputStream inputStream = file.getInputStream();
        Workbook workbook = Workbook.getWorkbook(inputStream);
        Sheet sheet = workbook.getSheet(0);

        for (int i = 1; i < sheet.getRows(); i++) { // Bỏ qua tiêu đề
            Subject newSubject = new Subject();
            newSubject.setMaMon(getCellValue(sheet, i, 0));
            newSubject.setTenMon(getCellValue(sheet, i, 1));
            newSubject.setSoTinChi(getCellValue(sheet, i, 2));
            newSubject.setHocKy(getCellValue(sheet, i, 3));
            newSubject.setNamHoc(getCellValue(sheet, i, 4));
            newSubject.setSoLuongSinhVien(getCellValue(sheet, i, 5));
            newSubject.setGv1(getCellValue(sheet, i, 6));
            newSubject.setGv2(getCellValue(sheet, i, 7));
            newSubject.setThoiGianThi(getCellValue(sheet, i, 8));
            newSubject.setPhongThi(getCellValue(sheet, i, 9));

            subjects.add(subjectService.handleCreateSubject(newSubject));
        }
        workbook.close();
        return subjects;
    }

    // Phương thức lấy giá trị từ ô Excel, tránh lỗi NullPointerException
    private String getCellValue(Sheet sheet, int row, int column) {
        return (sheet.getColumns() > column && sheet.getCell(column, row) != null) ? sheet.getCell(column, row).getContents().trim() : "";
    }

    // Chuyển đổi String sang Integer, tránh lỗi NumberFormatException
    private int parseInteger(String value) {
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException e) {
            return 0; // Giá trị mặc định nếu không đọc được số
        }
    }
}
